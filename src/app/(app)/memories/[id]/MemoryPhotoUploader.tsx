"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Trash2, Upload } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/utils";
import {
  addMemoryPhotoAction,
  deleteMemoryPhotoAction
} from "@/app/(app)/actions/memories";
import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/forms/FormMessage";

type Photo = { id: string; storage_path: string };

export function MemoryPhotoUploader({
  coupleId,
  memoryId,
  initialPhotos
}: {
  coupleId: string;
  memoryId: string;
  initialPhotos: Photo[];
}) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{
    kind: "error" | "success";
    text: string;
  } | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const entries = await Promise.all(
        photos.map(async (p) => {
          const { data } = await supabase.storage
            .from("memory-photos")
            .createSignedUrl(p.storage_path, 60 * 60);
          return [p.id, data?.signedUrl] as const;
        })
      );
      if (cancelled) return;
      const next: Record<string, string> = {};
      for (const [id, url] of entries) {
        if (url) next[id] = url;
      }
      setUrls(next);
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [photos, supabase]);

  async function onUpload(file: File) {
    setMessage(null);
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const safeExt = ext.replaceAll(/[^a-z0-9]/g, "");
    const path = `${coupleId}/${memoryId}/${crypto.randomUUID()}.${safeExt}`;

    const { error: uploadError } = await supabase.storage
      .from("memory-photos")
      .upload(path, file, { upsert: false, contentType: file.type || undefined });
    if (uploadError) {
      setMessage({ kind: "error", text: uploadError.message });
      return;
    }

    startTransition(async () => {
      const res = await addMemoryPhotoAction({ memoryId, storagePath: path });
      if (!res.ok) {
        setMessage({ kind: "error", text: res.message });
        await supabase.storage.from("memory-photos").remove([path]);
        return;
      }
      // Refresh list (cheap: refetch just photos for this memory)
      const { data } = await supabase
        .from("memory_photos")
        .select("id,storage_path")
        .eq("memory_id", memoryId)
        .order("created_at", { ascending: false });
      setPhotos((data ?? []) as Photo[]);
      setMessage({ kind: "success", text: "Photo added." });
    });
  }

  function onDelete(photoId: string) {
    if (!confirm("Remove this photo?")) return;
    setMessage(null);
    startTransition(async () => {
      const res = await deleteMemoryPhotoAction({ photoId });
      if (!res.ok) {
        setMessage({ kind: "error", text: res.message });
        return;
      }
      setPhotos((p) => p.filter((x) => x.id !== photoId));
      setMessage({ kind: "success", text: "Photo removed." });
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium">Photos</p>
        <label
          className={cn("inline-flex items-center gap-2", pending ? "opacity-70" : "")}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={pending}
            onChange={(e) => {
              const file = e.currentTarget.files?.[0];
              e.currentTarget.value = "";
              if (file) void onUpload(file);
            }}
          />
          <Button type="button" size="sm" variant="secondary" disabled={pending}>
            <Upload className="size-4" />
            Upload
          </Button>
        </label>
      </div>

      {message ? <FormMessage kind={message.kind} message={message.text} /> : null}

      {photos.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Add a photo or two — keep it subtle, keep it yours.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {photos.map((p) => (
            <div
              key={p.id}
              className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/70 shadow-card backdrop-blur dark:border-white/10 dark:bg-zinc-950/50"
            >
              {urls[p.id] ? (
                <Image
                  src={urls[p.id]!}
                  alt=""
                  width={800}
                  height={800}
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div className="aspect-square w-full animate-pulse bg-zinc-100 dark:bg-white/10" />
              )}
              <button
                type="button"
                onClick={() => onDelete(p.id)}
                className="absolute right-2 top-2 inline-flex size-9 items-center justify-center rounded-xl bg-black/60 text-white opacity-100 shadow-sm transition hover:bg-black/70 md:opacity-0 md:group-hover:opacity-100"
                aria-label="Delete photo"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
