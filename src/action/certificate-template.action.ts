import { supabase } from "@/lib/supabase";

export interface CertificateTemplate {
    id: string;
    name: string;
    preview_url: string | null;
    template_json: any;
    template_html: string | null;
    created_at: string;
    created_by: string;
}

export interface CreateTemplateInput {
    name: string;
    preview_url?: string;
    template_json: any;
    template_html: string;
}

export async function createCertificateTemplate(data: CreateTemplateInput) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data: template, error } = await supabase
        .from('certificate_templates')
        .insert([
            {
                ...data,
                created_by: userData.user.id
            }
        ])
        .select()
        .single();

    if (error) throw error;
    return template;
}

export async function getCertificateTemplates() {
    const { data, error } = await supabase
        .from('certificate_templates')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as CertificateTemplate[];
}

export async function deleteCertificateTemplate(id: string) {
    const { error } = await supabase
        .from('certificate_templates')
        .delete()
        .eq('id', id);

    if (error) throw error;
}

export async function updateCertificateTemplate(id: string, data: Partial<CreateTemplateInput>) {
    const { data: template, error } = await supabase
        .from('certificate_templates')
        .update(data)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return template;
}
