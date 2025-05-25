import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient'; 

interface QuestionOutput {
  id: number;
  questionText: string; 
  options: string[];
  correctAnswerIndex: number; 
  categoryId: string; 
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    if (!categoryId) {
      return NextResponse.json({ message: "categoryId is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('questions')
      .select('id, question_text, options, correct_answer_index, category_id')
      .eq('category_id', categoryId) 
      .order('id', { ascending: true });

    if (error) {
      console.error("Supabase error fetching questions:", error);
      throw error;
    }

    
    const questions: QuestionOutput[] = (data || []).map(q => ({
      id: q.id,
      questionText: q.question_text, 
      options: q.options as string[], 
      correctAnswerIndex: q.correct_answer_index, 
      categoryId: q.category_id, 
    }));

    return NextResponse.json(questions);

  } catch (err: any) {
    console.error("API error fetching questions:", err);
    return NextResponse.json({ message: err.message || "Error fetching questions from Supabase" }, { status: 500 });
  }
}