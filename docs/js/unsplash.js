const supabaseClient = supabase.createClient(
    'https://ltelhtkzlonffgpkymjp.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0ZWxodGt6bG9uZmZncGt5bWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MDkxODUsImV4cCI6MjA3MDQ4NTE4NX0.QUCjvnJPd6IbaalQTn8hhAxi31l-GHX2uqHfXlZaR84'
)

async function doGet(page, query) {
    try {
        const {data, error} = await supabaseClient.functions.invoke('unsplash-proxy', {
            body: JSON.stringify({
                endpoint: 'search/photos',
                query: query,
                page: page,
                per_page: 10
            })
        })

        if (error) throw error

        console.log('unsplash response', data)
    } catch (err) {
        console.error('Error fetching curated photos:', err)
        throw err
    }
}
