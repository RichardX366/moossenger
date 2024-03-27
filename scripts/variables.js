var firebaseConfig = {
  apiKey: "AIzaSyDifxjM6gqa1FGT3lEjY9WeVsRmtqCMm90",
  authDomain: "moossenger.firebaseapp.com",
  databaseURL: "https://moossenger.firebaseio.com",
  projectId: "moossenger",
  storageBucket: "moossenger.appspot.com",
  messagingSenderId: "211675813035",
  appId: "1:211675813035:web:2a7d8bc6a4446d96d693ee",
  measurementId: "G-VSQM66DX6H"
};
firebase.initializeApp(firebaseConfig);
var firestore = firebase.firestore();
var auth = firebase.auth();
var Contacts = [];
var selftext = document.querySelector("#selfText");
var content = document.querySelector("#content");
var login = document.querySelector("#login");
var options = document.querySelector("#options");
var clearChat = document.querySelector("#clearChat");
var volume = document.querySelector("#volume");
var notifCheck = document.querySelector("#notifCheck");
var soundCheck = document.querySelector("#soundCheck");
var ree = document.querySelector("#ree");
var chatArea = document.querySelector("#chatArea");
var notifswitch = document.querySelector("#notifSwitch");
var onlines = {};
var rgo = document.querySelector("#rgo");
var hashes = {};
var oldData = "";
var nonce = 0;
var moduloN = "13407807929942597099574024998205846127479365820592393377723561443721764030073546976801874298166903427690031858186486050853753882811946569946433649006084095";
var currentNotifs = [];
var stat = document.querySelector("#status");
var notifs = {};
var cmds = ["/shrug", "¯\\_(ツ)_/¯",
  "/algebraic", "| ( •◡•)| (❍ᴥ❍ʋ)",
  "/flip", "(╯°□°)╯︵ ┻━┻",
  "/happy", "ᕕ( ᐛ )ᕗ",
  "/facepalm", "(－‸ლ)",
  "/tableback", "┬──┬ ノ( ゜-゜ノ)",
  "/disapprove", "ಠ_ಠ",
  "/success", "(•̀ᴗ•́)و ̑̑"
];
var audio = document.querySelector("audio");
var user = document.querySelector("#name");
var load = document.querySelector("#load");
var oldConvos = {};
var isBanned = false;
var cmdDiv = document.querySelector("#commands");
var menu = document.querySelector("#menu");
var read = document.querySelector("#read");
var bans = document.querySelector("#banMenu");
var banDiv = document.querySelector("#banList");
var input = document.querySelector("#upload");
var timer = true;
var timer2 = true;
var spinner = document.querySelector("#timerLine");
var rDC = document.querySelector("#rDContainer");
var rD = document.querySelector("#requestDiv");
var isMobile = !!navigator.userAgent.match(/iphone|android|blackberry|ipad/ig) || false;
var blocks = document.querySelector("#blockMenu");
var blockDiv = document.querySelector("#blockList");
var gray = document.querySelector(".gray");
var timer3 = true;
var banNames = [];
var binput = document.querySelector("#binput");
var blockedUsers = [];