function f_02_obliekanie(canvas, enabled, homeDir) {

  var ciele = [];
  var images = [];

	this.act = new Activity(canvas, enabled);
  this.act.onDragDrop = function(sprite) {
   var ciel = sprite.findOverlapped(ciele);
   sprite.placeAt(ciel);
   document.getElementById("vypis").innerHTML = this.getResult();
   //console.log(sprite);

  }

  //ulozenie odpovede x
  localStorage.setItem("02_obliekanie", 'x');


	this.act.getResult=function() {

    console.log(app.solutionStr);
    var aktSol = "";
    var aktLocal = "";
    // ziskanie hodnot
    for (i = 0; i < ciele.length; i++){
			if (ciele[i].item != null) {
				aktSol = aktSol + ciele[i].item.number;
        if( i < ciele.length-1)
          aktLocal += ciele[i].item.number+',';
        else
          aktLocal += ciele[i].item.number;
			}
		}
    console.log(aktSol);
    if (aktSol.length > 0){
      if(aktSol == app.solutionStr) app.result='a';
      else app.result='b';
    }
    else {
      app.result='x';
    }
    console.log(app.result);

    //zapis aktualneho stavu do local storage
    if(check){
      localStorage.setItem("02_obliekanie", app.result );
    };

    return app.result;
	}

	var cesta = homeDir + '02_obliekanie_';

  for (var i=0; i< app.ic; i++){
      ciele[i] = new Sprite(this.act, '02_empty.gif', 100 +i*165, 150);
  };

  for (var i=0; i< app.ic; i++){
      //jednotlive obrazky pre cisla som vygenreoval cez php, skript generator.php je v priecinku pri obrazkoch
      images[i] = new Sprite(this.act, 'images/02_obr'+ app.order[i] +'.gif', 100 +i*165, 150, dragSprite);
      images[i].number = app.order[i];

      // priradenie aktualnych hodnot do poli - obrazky uz od zaciatku su v cielovych poliach
      images[i].placeAt(ciele[i]);

      console.log($(images[i]));
  };

};


//generovanie postupnosti
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

const app = new Vue({
  el: '#app',

  data: {
    game_desc: 'Usporiadaj obrázky tak, aby zľava doprava vyjadrovali postup, akým sa chlapec oblieka do školy.',
    game_desc2: 'Ťahaním obrázka a jeho pustením nad iným obrázkom si vymenia miesta.',
    solution: '',
    solutionStr: '',
    result: 'x',
    result_stat: '',
    isSolveDisabled: true,
    ic: 4,
    order: [],
    loadLocal: false
  },
  methods: {
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
        //premazanie vypisu o rieseni pri zmene cisel a samotny priebeh je hodeny na 'x'
        this.result_stat = '';
        this.result = 'x';
        //zmazanie povodnych ak su
        var arr = [];
        for (var i=0; i< this.ic; i++){
          arr.push(i);
        }
        this.order = shuffle(arr);
        console.log(this.order);
      };
      this.isSolveDisabled = false;
      //ulozenie aktualnej hry do localStorage
      this.solve();
      var saveorder = [...this.order].join();
      if(check){
        localStorage.setItem("aktGame", saveorder);
      };
    },
    //hladanie riesenia ulohy
    solve(val){
      var order = [...this.order];

      order.sort();
      //console.log(this.order);

      //solution ako pole
      this.solution = order;
      //solution ako cisla izieb bez medzier
      this.solutionStr = order.join().replace(/\,/g, '');
    }
  },
  beforeMount(){
    this.new_game();
  }
});
