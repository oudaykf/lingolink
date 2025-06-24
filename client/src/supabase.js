// Simplified Supabase client for direct API access
const supabaseUrl = 'https://tzvoplcsyxfjrsjfvfks.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6dm9wbGNzeXhmanJzamZ2ZmtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NTU2NzIsImV4cCI6MjA1OTQzMTY3Mn0.Pj805bCcraF42LpWWuVPrfQys2RIw_YtOpbo2lG1IjQ';

// Known users from the Supabase database
export const knownUsers = [
  {
    id: '38b036bd-be9e-48ac-9fae-2be03f4fadf3',
    name: 'Test User',
    email: 'test1743689336419@example.com',
    password: '$2a$10$BU8hXniDTIyIl',
    userType: 'client'
  },
  {
    id: '95d8a54e-21a3-40de-89fb-9fd5846a4dba',
    name: 'supabase-schema.sql',
    email: 'oudayh.kefi@gmail.com',
    password: '$2a$10$vGdlSf8BmcG',
    userType: 'translator'
  },
  {
    id: 'dcb0f047-fc5e-4b55-a2c0-691ac16a2289',
    name: 'kefi',
    email: 'ouday.kefi@gmail.com',
    password: '$2a$10$lVDcO/EHqF2',
    userType: 'translator'
  }
];

// Simple fetch wrapper for Supabase REST API
const fetchSupabase = async (path, options = {}) => {
  const url = `${supabaseUrl}/rest/v1${path}`;
  const headers = {
    'apikey': supabaseKey,
    'Authorization': `Bearer ${supabaseKey}`,
    'Content-Type': 'application/json',
    ...options.headers
  };

  console.log(`Supabase API request to: ${url}`, {
    method: options.method || 'GET',
    headers: headers,
    body: options.body ? JSON.parse(options.body) : undefined
  });

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    console.log(`Supabase API response status: ${response.status}`);

    // For debugging purposes, log the response headers
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });
    console.log('Response headers:', responseHeaders);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Supabase API error: ${response.status}`, errorText);
      throw new Error(`Supabase API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Supabase API response data:', data);
    return data;
  } catch (error) {
    console.error('Supabase fetch error:', error);
    throw error;
  }
};

// Simplified Supabase client
export const supabase = {
  from: (table) => ({
    select: (columns = '*') => ({
      eq: (column, value) => ({
        limit: (limit) => ({
          execute: async () => {
            try {
              const queryParams = new URLSearchParams();
              queryParams.append('select', columns);
              queryParams.append(column, value);
              queryParams.append('limit', limit);

              const data = await fetchSupabase(`/${table}?${queryParams.toString()}`, {
                method: 'GET'
              });

              return { data, error: null };
            } catch (error) {
              return { data: null, error };
            }
          }
        }),
        order: (orderColumn, { ascending = true } = {}) => ({
          execute: async () => {
            try {
              const queryParams = new URLSearchParams();
              queryParams.append('select', columns);
              queryParams.append(column, value);
              queryParams.append('order', `${orderColumn}.${ascending ? 'asc' : 'desc'}`);

              const data = await fetchSupabase(`/${table}?${queryParams.toString()}`, {
                method: 'GET'
              });

              return { data, error: null };
            } catch (error) {
              return { data: null, error };
            }
          }
        }),
        execute: async () => {
          try {
            const queryParams = new URLSearchParams();
            queryParams.append('select', columns);
            queryParams.append(column, value);

            const data = await fetchSupabase(`/${table}?${queryParams.toString()}`, {
              method: 'GET'
            });

            return { data, error: null };
          } catch (error) {
            return { data: null, error };
          }
        }
      }),
      execute: async () => {
        try {
          const queryParams = new URLSearchParams();
          queryParams.append('select', columns);

          const data = await fetchSupabase(`/${table}?${queryParams.toString()}`, {
            method: 'GET'
          });

          return { data, error: null };
        } catch (error) {
          return { data: null, error };
        }
      },
      limit: (limit) => ({
        execute: async () => {
          try {
            const queryParams = new URLSearchParams();
            queryParams.append('select', columns);
            queryParams.append('limit', limit);

            const data = await fetchSupabase(`/${table}?${queryParams.toString()}`, {
              method: 'GET'
            });

            return { data, error: null };
          } catch (error) {
            return { data: null, error };
          }
        }
      }),
      order: (column, { ascending = true } = {}) => ({
        execute: async () => {
          try {
            const queryParams = new URLSearchParams();
            queryParams.append('select', columns);
            queryParams.append('order', `${column}.${ascending ? 'asc' : 'desc'}`);

            const data = await fetchSupabase(`/${table}?${queryParams.toString()}`, {
              method: 'GET'
            });

            return { data, error: null };
          } catch (error) {
            return { data: null, error };
          }
        }
      })
    }),
    insert: (records) => ({
      select: (columns = '*') => ({
        execute: async () => {
          try {
            console.log('Inserting record into Supabase with return representation:', records);
            const data = await fetchSupabase(`/${table}`, {
              method: 'POST',
              headers: {
                'Prefer': 'return=representation'
              },
              body: JSON.stringify(records)
            });

            console.log('Supabase insert response:', data);
            return { data, error: null };
          } catch (error) {
            console.error('Error inserting record into Supabase:', error);
            return { data: null, error };
          }
        }
      }),
      execute: async () => {
        try {
          console.log('Inserting record into Supabase:', records);
          const data = await fetchSupabase(`/${table}`, {
            method: 'POST',
            headers: {
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(records)
          });

          console.log('Supabase insert response:', data);
          return { data, error: null };
        } catch (error) {
          console.error('Error inserting record into Supabase:', error);
          return { data: null, error };
        }
      }
    }),
    update: (updateData) => ({
      eq: (column, value) => ({
        select: (columns = '*') => ({
          execute: async () => {
            try {
              const queryParams = new URLSearchParams();
              queryParams.append(column, value);

              const data = await fetchSupabase(`/${table}?${queryParams.toString()}`, {
                method: 'PATCH',
                headers: {
                  'Prefer': 'return=representation'
                },
                body: JSON.stringify(updateData)
              });

              return { data, error: null };
            } catch (error) {
              return { data: null, error };
            }
          }
        }),
        execute: async () => {
          try {
            const queryParams = new URLSearchParams();
            queryParams.append(column, value);

            const data = await fetchSupabase(`/${table}?${queryParams.toString()}`, {
              method: 'PATCH',
              headers: {
                'Prefer': 'return=representation'
              },
              body: JSON.stringify(updateData)
            });

            return { data, error: null };
          } catch (error) {
            return { data: null, error };
          }
        }
      })
    }),
    delete: () => ({
      eq: (column, value) => ({
        execute: async () => {
          try {
            const queryParams = new URLSearchParams();
            queryParams.append(column, value);

            const data = await fetchSupabase(`/${table}?${queryParams.toString()}`, {
              method: 'DELETE',
              headers: {
                'Prefer': 'return=representation'
              }
            });

            return { data, error: null };
          } catch (error) {
            return { data: null, error };
          }
        }
      })
    })
  }),
  storage: {
    from: (bucket) => ({
      upload: async (path, file, options = {}) => {
        try {
          console.log(`Uploading file to ${bucket}/${path}`);

          // Create FormData
          const formData = new FormData();
          formData.append('file', file);

          // Set cache control if provided
          const cacheControl = options.cacheControl || '3600';

          // Set up the request
          const response = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${path}`, {
            method: 'POST',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Cache-Control': `max-age=${cacheControl}`,
              'x-upsert': options.upsert ? 'true' : 'false'
            },
            body: formData
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Storage upload error:', errorText);
            throw new Error(`Storage upload error: ${response.status} ${errorText}`);
          }

          const data = await response.json();
          console.log('Storage upload response:', data);

          return { data, error: null };
        } catch (error) {
          console.error('Storage upload exception:', error);
          return { data: null, error };
        }
      },
      getPublicUrl: (path) => {
        try {
          const publicURL = `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
          return { publicURL, error: null };
        } catch (error) {
          console.error('Get public URL error:', error);
          return { publicURL: null, error };
        }
      },
      remove: async (paths) => {
        try {
          const response = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${Array.isArray(paths) ? paths.join(',') : paths}`, {
            method: 'DELETE',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`
            }
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Storage remove error:', errorText);
            throw new Error(`Storage remove error: ${response.status} ${errorText}`);
          }

          const data = await response.json();
          console.log('Storage remove response:', data);

          return { data, error: null };
        } catch (error) {
          console.error('Storage remove exception:', error);
          return { data: null, error };
        }
      }
    })
  }
};

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('users').select('count').limit(1).execute();

    if (error) {
      console.error('Supabase connection error:', error.message);
      return false;
    }

    console.log('Supabase connection successful');
    return true;
  } catch (error) {
    console.error('Supabase connection exception:', error.message);
    return false;
  }
};

// Direct API call to insert a user into Supabase
export const directInsertUser = async (userData) => {
  try {
    console.log('Making direct API call to insert user:', userData);

    const response = await fetch(`${supabaseUrl}/rest/v1/users`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(userData)
    });

    console.log('Direct API response status:', response.status);

    // Log response headers
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });
    console.log('Direct API response headers:', responseHeaders);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Direct API error:', errorText);
      throw new Error(`Direct API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Direct API response data:', data);
    return { data, error: null };
  } catch (error) {
    console.error('Direct API exception:', error);
    return { data: null, error };
  }
};

// Function to save user profile data to Supabase
export const saveUserProfile = async (userId, profileData) => {
  try {
    console.log('Saving user profile to Supabase:', profileData);

    // First check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .execute();

    if (checkError) {
      console.error('Error checking existing profile:', checkError);
      return { data: null, error: checkError };
    }

    let result;

    if (existingProfile && existingProfile.length > 0) {
      // Update existing profile
      result = await supabase
        .from('profiles')
        .update(profileData)
        .eq('user_id', userId)
        .select('*')
        .execute();
    } else {
      // Insert new profile
      result = await supabase
        .from('profiles')
        .insert([{ user_id: userId, ...profileData }])
        .select('*')
        .execute();
    }

    if (result.error) {
      console.error('Error saving profile:', result.error);
      return { data: null, error: result.error };
    }

    console.log('Profile saved successfully:', result.data);
    return { data: result.data, error: null };
  } catch (error) {
    console.error('Exception saving profile:', error);
    return { data: null, error };
  }
};

// Function to upload profile image to Supabase Storage
export const uploadProfileImage = async (userId, file) => {
  try {
    console.log('Uploading profile image for user:', userId);

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = `profile-images/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase
      .storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true
      });

    if (error) {
      console.error('Error uploading image:', error);
      return { data: null, error };
    }

    // Get public URL
    const { publicURL, error: urlError } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(filePath);

    if (urlError) {
      console.error('Error getting public URL:', urlError);
      return { data: null, error: urlError };
    }

    console.log('Image uploaded successfully:', publicURL);

    // Update user profile with image URL
    const { data: profileData, error: profileError } = await saveUserProfile(userId, {
      avatar_url: publicURL
    });

    if (profileError) {
      console.error('Error updating profile with image URL:', profileError);
      return { data: publicURL, error: profileError };
    }

    return { data: publicURL, error: null };
  } catch (error) {
    console.error('Exception uploading image:', error);
    return { data: null, error };
  }
};
