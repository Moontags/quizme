
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Notes() {
 
  const supabase = await createClient();
  const { data: notes } = await supabase.from('notes').select()

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes?.map((note) => (
          <li key={note.id}>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
