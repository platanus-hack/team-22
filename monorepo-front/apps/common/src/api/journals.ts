import { supabase } from '../supabase/index';
import { DateTime } from 'luxon';

export const fetchJournalEntries = async (
  startDate: DateTime,
  endDate: DateTime,
  userId: string
) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .gte('created_at', startDate.toISO())
    .lte('created_at', endDate.toISO())
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching journal entries:', error);
    return {};
  }

  // Convert array of entries to Record<string, string>
  return data.reduce((acc, entry) => {
    const date = DateTime.fromISO(entry.created_at).toFormat('yyyy-MM-dd');
    // If there's already content for this date, concatenate with a separator
    if (acc[date]) {
      acc[date] = `${acc[date]}\n---\n${entry.content}`;
    } else {
      acc[date] = entry.content;
    }
    return acc;
  }, {} as Record<string, string>);
};
