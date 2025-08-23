const supabaseClient = supabase.createClient(
    'https://ltelhtkzlonffgpkymjp.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0ZWxodGt6bG9uZmZncGt5bWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MDkxODUsImV4cCI6MjA3MDQ4NTE4NX0.QUCjvnJPd6IbaalQTn8hhAxi31l-GHX2uqHfXlZaR84'
)

async function doGet(page, query) {
    try {
        const { data, error } = await supabaseClient.functions.invoke('unsplash-proxy', {
            body: JSON.stringify({
                endpoint: 'search/photos',
                query: query,
                page: page,
                per_page: 12 // A good number for a grid layout
            })
        })

        if (error) throw error

        // The response from the edge function might be a string, so parse it.
        const responseData = typeof data === 'string' ? JSON.parse(data) : data;
        return responseData.results || []; // Return the array of photos

    } catch (err) {
        console.error('Error fetching photos from Unsplash proxy:', err)
        return []; // Return an empty array on error to prevent crashes
    }
}

async function getPhotoDetails(photoId) {
    try {
        const { data, error } = await supabaseClient.functions.invoke('unsplash-proxy', {
            body: JSON.stringify({
                endpoint: `photos/${photoId}`
            })
        });

        if (error) throw error;

        return typeof data === 'string' ? JSON.parse(data) : data;

    } catch (err) {
        console.error(`Error fetching details for photo ${photoId}:`, err);
        return null; // Return null on error
    }
}
