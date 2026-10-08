import { put, get, del } from '@vercel/blob';

export function blobStorage() {
  return {
    async put(
      key: string,
      data: Uint8Array,
      options?: { httpMetadata?: { contentType?: string } }
    ) {
      return put(key, Buffer.from(data), {
        access: 'private',
        contentType: options?.httpMetadata?.contentType,
        addRandomSuffix: false,
      });
    },

    async get(key: string) {
      const result = await get(key, { access: 'private' });
      if (!result) return null;

      return {
        body: result.stream,
        size: result.blob.size,
      };
    },

    async delete(key: string) {
      await del(key);
    },
  };
}
