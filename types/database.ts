export interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  gender: string | null;
  location: string | null;
  profession: string | null;
  created_at: string;
  updated_at: string;
}

export interface News {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  video_url: string | null;
  source_name: string | null;
  source_url: string | null;
  published_at: string;
  created_at: string;
}

export interface Comment {
  id: string;
  news_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface NewsWithComments extends News {
  comment_count?: number;
  profiles?: Profile;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      news: {
        Row: News;
        Insert: Omit<News, 'id' | 'created_at'>;
        Update: Partial<Omit<News, 'id' | 'created_at'>>;
      };
      comments: {
        Row: Comment;
        Insert: Omit<Comment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Comment, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
