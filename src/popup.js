const postService = require('./services/post.service');

postService.sendRuntimeMessage('downloadAuctionPages').then(() => console.log('Success'));
