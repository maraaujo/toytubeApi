import youtubeApi from './youtubeApi';

export const getLiveAudience = async (channelId) => {
  try {
    const channelResponse = await youtubeApi.get('/channels', {
      params: {
        id: channelId,
        part: 'snippet',
      },
    });
    const channelName = channelResponse.data.items[0]?.snippet.title || 'Canal desconhecido';

    const searchResponse = await youtubeApi.get('/search', {
      params: {
        channelId: channelId,
        type: 'video',
        eventType: 'live',
        part: 'snippet',
      },
    });
    const liveVideos = searchResponse.data.items;

    let totalViewers = 0;

    for (const video of liveVideos) {
      const videoId = video.id.videoId;
      const videoDetailsResponse = await youtubeApi.get('/videos', {
        params: {
          id: videoId,
          part: 'liveStreamingDetails',
        },
      });
      const liveDetails = videoDetailsResponse.data.items;

      if (liveDetails.length > 0) {
        const concurrentViewers = liveDetails[0].liveStreamingDetails?.concurrentViewers || 0;
        totalViewers += parseInt(concurrentViewers, 10);
      }
    }

    return { channelName, totalViewers: Math.round(totalViewers) };
  } catch (error) {
    console.error(`Erro ao encontrar canal ${channelId}:`, error);
    return { channelName: 'Canal desconhecido', totalViewers: 0 };
  }
};

export const getTotalAudience = async (channelIds) => {
  try {
    const promises = channelIds.map((id) => getLiveAudience(id));
    const audienceData = await Promise.all(promises);
    return audienceData;
  } catch (error) {
    console.error('Erro ao encontrar canal', error);
    return channelIds.map((id) => ({ channelName: 'Canal desconhecido', totalViewers: 0 }));
  }
};

