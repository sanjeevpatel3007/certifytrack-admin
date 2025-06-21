import { supabase } from "../supabase";

export async function uploadImage(file: File, folder: string) {
    try {
        // Generate a unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        // Upload the file
        const { error: uploadError, data } = await supabase.storage
            .from('certifytrack')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
            .from('certifytrack')
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
} 