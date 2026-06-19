import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yuiwnxvcrwewnabkfqnt.supabase.co'
const supabaseKey = 'sb_publishable_QjDxvqYV-PtVh4pXKC533w_OaPQ_ROt'

export const supabase = createClient(supabaseUrl, supabaseKey)
