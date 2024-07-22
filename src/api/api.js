import youtubeApi from './youtubeApi';

export const getLiveAudience = async (channelId) => {
  try {
    const channelResponse = await youtubeApi.get('/channels', {
      params: {
        id: channelId,
        part: 'snippet'
      }
    });
    const channelName = channelResponse.data.items[0]?.snippet.title || 'Unknown Channel';

    const searchResponse = await youtubeApi.get('/search', {
      params: {
        channelId: channelId,
        type: 'video',
        eventType: 'live',
        part: 'snippet'
      }
    });
    const liveVideos = searchResponse.data.items;

    let totalViewers = 0;

    for (const video of liveVideos) {
      const videoId = video.id.videoId;
      const videoDetailsResponse = await youtubeApi.get('/videos', {
        params: {
          id: videoId,
          part: 'liveStreamingDetails'
        }
      });
      const liveDetails = videoDetailsResponse.data.items;

      if (liveDetails.length > 0) {
        const concurrentViewers = liveDetails[0].liveStreamingDetails?.concurrentViewers || 0;
        totalViewers += parseInt(concurrentViewers, 10);
      }
    }

    return { channelName, totalViewers };
  } catch (error) {
    console.error(`Error fetching live audience for channel ${channelId}:`, error);
    return { channelName: 'Unknown Channel', totalViewers: 0 };
  }
};

export const getTotalAudience = async (channelIds) => {
  try {
    const promises = channelIds.map(id => getLiveAudience(id));
    const audienceData = await Promise.all(promises);
    return audienceData;
  } catch (error) {
    console.error('Error fetching total audience:', error);
    return channelIds.map(id => ({ channelName: 'Unknown Channel', totalViewers: 0 }));
  }
};
