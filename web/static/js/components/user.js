import PopUps from './pop_ups';
import Board from './board';

const User = (() => {
  function initChannelEvents (socket, channel) {
    let userInfo = null;

    channel.on("offer_game", resp => {
      const username = resp.to.username;

      if (username === userInfo.username) {
        PopUps.startGame(() => {
          // fire code to enter a game for the current user
          Board.newGame(id => {
            const payload = {
              to: resp.from.username,
              game_id: id
            }
            channel.push("start_game", payload);
          });
        });
      }
    });

    channel.on("start_game", resp => {
      if (userInfo !== null && resp.to.username === userInfo.username) {
        Board.enterGame(resp.game_id);
      }
    });

    channel.on("user_info", resp => {
      userInfo = resp;
    });
  }

  return {
    init: socket => {
      const userChannel = socket.channel("users:all");

      userChannel.join()
        .receive("ok", resp => console.log("joined the game channel", resp))
        .receive("error", reason => console.log("join failed", reason));

      initChannelEvents(socket, userChannel);
      userChannel.push("get_user_info");

      if (window.location.pathname.indexOf('game') === -1) {
        PopUps.offerGame(target => {
          userChannel.push("offer_game", target);
        });
      }
    }
  }
})()

export default User;
