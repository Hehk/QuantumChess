// defines the popups used throughout the app

const popUps = {
  startGame: onJoin => {
    const popUp = document.createElement('div');
    const body = document.body;

    function closePopUp () {
      body.removeChild(popUp);
    }

    popUp.className = 'pop-up game-start';
    popUp.innerHTML = `
      <div class="title">Join Game</div>
      <div class="options">
        <div class="btn join">Join</div>
        <div class="btn cancel">Cancel</div>
      </div>`;

    popUp.getElementsByClassName('join')[0].onclick = () => {
      closePopUp();
      if (typeof onJoin === 'function') {
        onJoin();
      }
    }

    popUp.getElementsByClassName('cancel')[0].onclick = closePopUp;

    document.body.appendChild(popUp);
  },
  offerGame: onOffer => {
    const popUp = document.createElement('div');
    const body = document.body;

    function closePopUp () {
      body.removeChild(popUp);
    }

    popUp.className = 'pop-up game-start';
    popUp.innerHTML = `
      <div class="title">Join Game</div>
      <div class="mdl-textfield">
        <label class="mdl-textfield__label" for="username_input">Password</label>
        <input class="mdl-textfield__input" id="username_input" type="text">
      </div>
      <div class="btn offer">Offer Game</div>`;

    popUp.getElementsByClassName('offer')[0].onclick = _ => {
      const inputValue = popUp.getElementsByClassName('input')[0].value;
      closePopUp();

      if (typeof onOffer === 'function') {
        onOffer(inputValue);
      }
    }

    document.body.appendChild(popUp);
  },
  winFlag: params => {
    const popUp = document.createElement('div');
    const body = document.body;

    popUp.className = 'win-flag';
    popUp.innerHTML = `
      <div class="title">WIN</div>
      <div class="content">
        <div class="prev-elo">
          Prev Elo: 69
        </div>
        <div class="new-elo">
          New Elo: 1337
        </div>
      </div>`;

    document.body.appendChild(popUp);
  },
  lossFlag: params => {
    const popUp = document.createElement('div');
    const body = document.body;

    popUp.className = 'loss-flag';
    popUp.innerHTML = `
      <div class="title">LOSS</div>
      <div class="content">
        <div class="prev-elo">
          Prev Elo: 69
        </div>
        <div class="new-elo">
          New Elo: 1337
        </div>
      </div>`;

    document.body.appendChild(popUp);
  }
}

export default popUps;
