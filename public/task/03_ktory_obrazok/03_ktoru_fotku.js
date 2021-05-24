function f_03_ktoru_fotku(canvas, enabled, homeDir) {

  var ciele = [];
  var images = [];

	this.act = new Activity(canvas, enabled);

  this.act.onClick = function(sprite) {
      //premazanie highlightu na predoslom kliknutom elemente
      this.sprites.forEach(function(s){
        s.highlight = null;
      });
      sprite.highlight = true;
      app.selected = [sprite.head, sprite.obj, sprite.bground];
		  document.getElementById('vypis').innerHTML = this.getResult();
	}

//ulozenie odpovede x
localStorage.setItem("03_ktory_obrazok", 'x');


	this.act.getResult=function() {

    var aktSol = "";
    var aktLocal = "";

    console.log(app.selected);
    var goal = 0;
    console.log(app.a1 + app.a2 + app.a3);
    switch(app.a1){
      case "Áno":
        if(app.selected[0] == "parasol") goal++;
        break;
      case "Nie":
        if(app.selected[0] == "ball") goal++;
        break;
    }
    switch(app.a2){
      case "Áno":
        if(app.selected[1] == "hat") goal++;
        break;
      case "Nie":
        if(app.selected[1] == "nohat") goal++;

        break;
    }
    switch(app.a3){
      case "Áno":
        if(app.selected[2] == "sea") goal++;
        break;
      case "Nie":
        if(app.selected[2] == "hills") goal++;
        break;
    }
    console.log(goal);

    if (goal >=0){
      if(goal == 3) app.result='a';
      else app.result='b';
    }
    else {
      app.result='x';
    }
    console.log(app.result);

    //zapis aktualneho stavu do local storage
    if(check){
      localStorage.setItem("aktGame", aktLocal );
    };


  localStorage.setItem("03_ktory_obrazok", app.result);
    return app.result;
	}

	var cesta = homeDir + '03_ktoru_fotku_';

  for (var i=0; i< app.ic; i++){
      //jednotlive obrazky pre cisla som vygenreoval cez php, skript generator.php je v priecinku pri obrazkoch
      if (i < 4){
        images[i] = new Sprite(this.act, 'images/'+ app.order[i][0] +'.jpg', 100 +i*200, 100, clickSprite);
      }
      else{
        images[i] = new Sprite(this.act, 'images/'+ app.order[i][0] +'.jpg', 100 +(i-4)*200, 280, clickSprite);
      }
      images[i].head = app.order[i][1];
      images[i].obj = app.order[i][2];
      images[i].bground = app.order[i][3];

      console.log($(images[i]));
  };

};


// miesanie pola
function shuffle(array) {
  var curr = array.length;
  var tmp;
  var rnd;
  // prechod od posledneho elementu az po prvy
  while (0 !== curr) {
    rnd= Math.floor(Math.random() * curr);
    curr -= 1;

    tmp = array[curr];
    array[curr] = array[rnd];
    array[rnd] = tmp;
  }

  return array;
};

//kontrola pre localStorage
//ak nevyhodi vynimku je mozne pracovat s localStorage
function checkStorage() {
  try {
    const key = "test_string";
    localStorage.setItem(key, key);
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    return false;
  }
};

var check = checkStorage();


var data= {
    "0":  ["1", "ball", "hat", "sea"],
    "1":  ["2", "parasol", "hat", "sea"],
    "2":  ["3", "ball", "nohat", "hills"],
    "3":  ["4", "ball", "nohat", "sea"],
    "4":  ["5", "parasol", "hat", "hills"],
    "5":  ["6", "ball", "hat", "hills"],
    "6":  ["7", "parasol", "nohat", "hills"],
    "7":  ["8", "parasol", "nohat", "sea"],
};

const app = new Vue({
  el: '#app',

  data: {
    game_desc: 'Janko má 8 fotiek z dovolenky. Nevedel, ktorú má darovať Beáte, preto jej zavolal:',
    game_desc2: 'Klikni na fotku, ktorú má dať Beáte, aby splnil všetky jej želania.',
    q1: '<q>Chceš fotku so slnečníkom?</q>&nbsp;',
    q2: '<q>Chceš fotku, kde mám niečo na hlave?</q>&nbsp;',
    q3: '<q>Chceš fotku, kde vidno more?</q>&nbsp;',
    a1: '',
    a2: '',
    a3: '',
    yn: [true, false],
    selected: [],
    result: 'x',
    result_stat: '',
    isSolveDisabled: true,
    ic: 8,
    order: [],
    loadLocal: false
  },
  methods: {
    //generovanie noveho usporiadania obrazkov a otazok
    new_game(val) {
      //localStorage.removeItem("aktGame");
      //nacitanie dat z localStorage
      if(this.loadLocal && check && localStorage.getItem("aktGame")){
          //console.log(localStorage.getItem("aktGame").split(',').map(Number));
          console.log(localStorage.getItem("aktGame"));
          this.order = localStorage.getItem("aktGame").split(',').map(Number);
          this.isSolveDisabled = false;
          this.solve();
          //aby stale nebol volane nacitanie z local storage
          this.loadLocal = false;
      }
      else{
        this.result_stat = '';
        this.result = 'x';
        //zmazanie povodnych ak su
        var arr = [];
        console.log(data);
        for (var i=0; i< this.ic; i++){
              arr.push(data[i]);
        }
        this.order = shuffle(arr);
        console.log(this.order);

        this.a1 = this.answerTxt(this.yn[Math.floor(Math.random() * this.yn.length)]);
        this.a2 = this.answerTxt(this.yn[Math.floor(Math.random() * this.yn.length)]);
        this.a3 = this.answerTxt(this.yn[Math.floor(Math.random() * this.yn.length)]);
        console.log(this.a1 + this.a2 + this.a3)
      };
      this.isSolveDisabled = false;
      //ulozenie aktualnej hry do localStorage
      var saveorder = [...this.order].join();
      if(check){
        localStorage.setItem("aktGame", saveorder);
      };
      //incicializacia sprites2v.js
      //uloha = new f_03_ktoru_fotku("canvas", true, homeDir);
      //console.log(uloha);
    },
    answerTxt(bl){
      switch(bl){
        case true:
          return 'Áno';
          break;
        case false:
         return 'Nie'
         break;
      }
    }
  },
  // volanie new_game() pri nacitani stranky kvoli nacitaniu dat z localStorage
  beforeMount(){
    this.new_game();
  }
});
