import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabaseClient'; 

export interface CategoryOutput {
  id: string;
  name: string;
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name')
      .order('name', { ascending: true });

    if (error) {
      console.error("Supabase error fetching categories:", error);
      throw error; 
    }

    const categories: CategoryOutput[] = data || [];
    return NextResponse.json(categories);

  } catch (err: any) {
    console.error("API error fetching categories:", err);
    return NextResponse.json({ message: err.message || "Error fetching categories from Supabase" }, { status: 500 });
  }
}