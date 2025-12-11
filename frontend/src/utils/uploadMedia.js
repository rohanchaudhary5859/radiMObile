/**
 * uploadMedia.js
 * Upload images / videos to Supabase Storage
 * 
 * Usage:
 * const url = await uploadMedia('posts', fileUri);
 */

import * as FileSystem from 'expo-file-system';
import { supabase } from '../config/supabase';
import { decode } from 'base64-arraybuffer';

/**
 * Upload any file (image/video) from device to Supabase storage.
 * bucket = 'posts' | 'reels' | 'stories' | 'chat_media' | etc.
 */
export default async function uploadMedia(bucket, uri, fileName = null) {
  try {
    if (!uri) throw new Error("No file URI provided");

    const fileExt = uri.split('.').pop();
    const name = fileName || `${Date.now()}.${fileExt}`;

    // Convert file -> base64
    const base64File = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Remove "data:image/png;base64," prefix
    const cleanedBase64 = base64File.replace(/^data:.*;base64,/, '');

    // Convert to binary
    const fileBuffer = decode(cleanedBase64);

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(name, fileBuffer, {
        contentType: fileExt.includes("mp4") ? 'video/mp4' : `image/${fileExt}`,
        upsert: true,
      });

    if (error) throw error;

    // Generate public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(name);

    return urlData.publicUrl;
  } catch (err) {
    console.log("Upload error:", err);
    return null;
  }
}
