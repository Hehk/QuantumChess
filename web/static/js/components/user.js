import PopUps from './pop_ups';
import Board from './board';

const User = (() => {
  function initChannelEvents (socket, channel) {
    channel.on("offer_game", resp => {
      const username = resp.target.username;

      if (username === "hehk") {
        PopUps.offerGame(() => {
          // fire code to enter a game for the current user
          Board.newGame(id => {
            const payload = {
              target: resp.user.username,
              game_id: id
            }
            channel.push("start_game", payload);
          });
        });
      }
    });

    channel.on("start_game", resp => {
      if (resp.target.username === "anon") {
        Board.enterGame(resp.game_id);
      } else {
        console.log('new Game started for ' + resp.target.username);
      }
    });
  }

  return {
    init: socket => {
      const userChannel = socket.channel("users:all");

      userChannel.join()
        .receive("ok", resp => console.log("joined the game channel", resp))
        .receive("error", reason => console.log("join failed", reason));

      initChannelEvents(socket, userChannel);
      userChannel.push("offer_game", "hehk");
    }
  }
})()

export default User;
