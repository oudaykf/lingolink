-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id) NOT NULL,
    receiver_id UUID REFERENCES auth.users(id) NOT NULL,
    content TEXT NOT NULL,
    translation_request_id UUID REFERENCES translation_requests(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    is_system_message BOOLEAN DEFAULT false
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_translation_request ON messages(translation_request_id);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own messages"
    ON messages FOR SELECT
    USING (
        auth.uid() = sender_id OR 
        auth.uid() = receiver_id
    );

CREATE POLICY "Users can insert their own messages"
    ON messages FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id
    );

CREATE POLICY "Users can update their own messages"
    ON messages FOR UPDATE
    USING (
        auth.uid() = sender_id
    );

-- Create function to notify on new message
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify(
        'new_message',
        json_build_object(
            'id', NEW.id,
            'sender_id', NEW.sender_id,
            'receiver_id', NEW.receiver_id,
            'content', NEW.content,
            'translation_request_id', NEW.translation_request_id,
            'created_at', NEW.created_at
        )::text
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new messages
CREATE TRIGGER on_new_message
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_message(); 