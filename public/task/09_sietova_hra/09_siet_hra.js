function f_09_siet_hra(canvas, enabled, homeDir) {

  var places = [];
  var images = [];

	this.act = new Activity(canvas, enabled);
  this.act.onDragDrop = function(sprite) {
   var place = sprite.findOverlapped(places);
   sprite.placeAt(place);
   //document.getElementById("vypis").innerHTML = this.getResult();
   //console.log(sprite);
  }

  this.act.onClick = function(sprite) {
   //jediny clickSprite
   // sluzi na reset
   for(var i in images){
     images[i].place = null;
   }
  }

  localStorage.setItem("09_sietova_hra", 'x');


	this.act.getResult=function() {

    console.log(app.solution);
    var aktSol = "";

    if (aktSol.length > 0){
      if(aktSol == app.solutionStr) app.result='a';
      else app.result='b';
    }
    else {
      app.result='x';
    }
    console.log(app.result);

    localStorage.setItem("09_sietova_hra", app.result);
    return app.result;
	}

  var background = new Sprite(this.act, 'images/09_siethra.png', 400, 200);
  //pozicie bobrov ktore sa daju tahat
  for (var i=0; i< app.ic; i++){
      //jednotlive obrazky pre cisla som vygenreoval cez php, skript generator.php je v priecinku pri obrazkoch
      images[i] = new Sprite(this.act, 'images/'+ app.data[i].name +'.png', 130, 25 +i*70, dragSprite);
      images[i].akt = app.data[i].akt;
      images[i].name = app.data[i].name;
      console.log($(images[i]));
  };
  //pozicie na vkladanie - cielove
  for (var i=0; i< app.ic; i++){
      //jednotlive obrazky pre cisla som vygenreoval cez php, skript generator.php je v priecinku pri obrazkoch
      places[i] = new Sprite(this.act, 'images/empty.png', 650, 25 +i*70);
  };
  //zvysok pozicii - rucne hladany s pomocou test.png - pre nahlad staci zamenit empty.png za test.png
  // 1. riadok
  places.push(new Sprite(this.act, 'images/empty.png', 240, 35));
  places.push(new Sprite(this.act, 'images/empty.png', 240, 75));
  places.push(new Sprite(this.act, 'images/empty.png', 340, 55));
  places.push(new Sprite(this.act, 'images/empty.png', 340, 95));
  places.push(new Sprite(this.act, 'images/empty.png', 445, 25));
  places.push(new Sprite(this.act, 'images/empty.png', 445, 65));
  places.push(new Sprite(this.act, 'images/empty.png', 545, 55));
  places.push(new Sprite(this.act, 'images/empty.png', 545, 95));
  // 2. riadok
  places.push(new Sprite(this.act, 'images/empty.png', 365, 165));
  places.push(new Sprite(this.act, 'images/empty.png', 365, 205));
  places.push(new Sprite(this.act, 'images/empty.png', 485, 145));
  places.push(new Sprite(this.act, 'images/empty.png', 485, 185));
  // 3. riadok
  places.push(new Sprite(this.act, 'images/empty.png', 265, 255));
  places.push(new Sprite(this.act, 'images/empty.png', 265, 295));
  places.push(new Sprite(this.act, 'images/empty.png', 395, 265));
  places.push(new Sprite(this.act, 'images/empty.png', 395, 305));
  places.push(new Sprite(this.act, 'images/empty.png', 530, 250));
  places.push(new Sprite(this.act, 'images/empty.png', 530, 290));
  //reset na klik
  var reset = new Sprite(this.act, 'images/reset.png', 657, 385, clickSprite);


};



const app = new Vue({
  el: '#app',

  data: {
    game_desc: 'Päť bobrov hrá hru, pri ktorej sa hráči presúvajú po oblakoch podľa nasledujúcich pravidiel:',
    game_desc2: 'Ťahaním mien na obláčiky si môžeš presúvanie bobrov vyskúšať. Číslo v zátvorke je vek bobra.',
    dataDesc: [
      "Každý bobor sa presunie v smere šípky na oblak a čaká kým naň príde ďalší bobor.",
      "Potom <b>starší</b> bobor odíde na nasledujúci oblak po šípke s <b>hrubšou čiarou</b> a <b>mladší</b> po šípke s <b>tenšou čiarou</b>.",
      "Takto postupujú až na cieľové políčka."
    ],
    q: "Na akých cieľových pozíciách skončia jednotlivé bobry?",
    prepSol: {
      a: ["Anna", "Braňo", "Cyril", "Dana", "Ema"],
      b: ["Ema", "Dana", "Cyril", "Braňo", "Anna"],
      c: ["Braňo", "Dana", "Cyril", "Anna", "Ema"],
      d: ["Braňo", "Cyril", "Dana", "Anna", "Ema"]
    },
    data:{
      0: {
        name: "anna",
        age: 7,
        akt: "start-1",
        cango: "A"
      },
      1: {
        name: "brano",
        age: 8,
        akt: "start-2",
        cango: "A"
      },
      2: {
        name: "cyril",
        age: 9,
        akt: "start-3",
        cango: "B"
      },
      3: {
        name: "dana",
        age: 10,
        akt: "start-4",
        cango: "G"
      },
      4: {
        name: "ema",
        age: 11,
        akt: "start-5",
        cango: "G"
      }
    },
    graph: {
        A: {
          in: [],
          oldOut: "E",
          youthOut: "B"
        },
        B: {
          in: [],
          oldOut: "E",
          youthOut: "C"
        },
        C: {
          in: [],
          oldOut: "F",
          youthOut: "fin-4"
        },
        D: {
          in: [],
          oldOut: "fin-3",
          youthOut: "fin-1"
        },
        E: {
          in: [],
          oldOut: "H",
          youthOut: "F"
        },
        F: {
          in: [],
          oldOut: "I",
          youthOut: "D"
        },
        G: {
          in: [],
          oldOut: "H",
          youthOut: "C"
        },
        H: {
          in: [],
          oldOut: "I",
          youthOut: "D"
        },
        I: {
          in: [],
          oldOut: "fin-5",
          youthOut: "fin-2"
        }
    },
    solution: '',
    correct: 'c',
    result: 'x',
    result_stat: '',

    ic: 5,
    loadLocal: false
  },
  methods: {
    //generovanie novych izieb po stlaceni enteru v prislusnom inpute
    new_game(val) {
      this.result_stat = '';
      this.result = 'x';
      // riesenie je presne dane na c),
      //inak je algoritmicky v this.solve zapisane v aktualnych poziciach bobrov
      this.solve();


    },
    //hladanie riesenia ulohy
    solve(val){
      console.log(this.graph);
      var breakpoint = 0
      while(1){
        var break2=0;
        for (var key in this.data) {

          console.log("move bobor: ", this.data[key].name);
          //ak uz nie je v cieli
          if(!this.data[key].akt.includes("fin")) this.move(this.data[key]);
          else break2++;
        }
        // safepoint pre zacyklenie nek. cyklu
        breakpoint++;
        if(breakpoint > 50 || break2 == 4) break;

      }
      for (var key in this.data) {
        console.log(this.data[key].name, this.data[key].akt);
      }
    },
    move(bobor){
      //ak je na starte tak presun
      if((bobor.akt).includes("start")) {
        // posun a update v grafe
        var poz = bobor.cango;
        bobor.akt = poz;
        this.graph[poz].in.push(bobor);
      }
      else{
        //console.log(bobor.akt, this.graph[bobor.akt].in);
        if(this.graph[bobor.akt].in.length == 2){
          //ak su v bode dvaja
          console.log("from:", bobor.akt);
          var b0 = this.graph[bobor.akt].in[0];
          var b1 = this.graph[bobor.akt].in[1];

          if(b0.age > b1.age){
            b0.akt = this.graph[b0.akt].oldOut;
            b1.akt = this.graph[b1.akt].youthOut;

            if(!b0.akt.includes("fin")) this.graph[b0.akt].in.push(b0);
            if(!b1.akt.includes("fin")) this.graph[b1.akt].in.push(b1);

            console.log("older is", b0.name, "-->", b0.akt, "; ", b1.name, "-->", b1.akt);
          }
          else{
            b1.akt = this.graph[b1.akt].oldOut;
            b0.akt = this.graph[b0.akt].youthOut;

            if(!b0.akt.includes("fin")) this.graph[b0.akt].in.push(b0);
            if(!b1.akt.includes("fin")) this.graph[b1.akt].in.push(b1);

            console.log("younger is", b0.name, "-->", b0.akt, "; ", b1.name, "-->", b1.akt);
          }
        }
      }
    },
    checkSol(answer){
      //console.log(answer);
      if (answer == this.correct) this.result="a";
      else this.result="b";
    }
  },
  // volanie new_game() pri nacitani stranky kvoli nacitaniu dat z localStorage
  beforeMount(){
    this.new_game();
  }
});
