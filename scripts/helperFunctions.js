function change(x) {
  return x.replace(/\/8ball/g, function() {
    return [
      "No",
      "Yes",
      "Without a doubt",
      "Very doubtful",
      "It is certain",
      "It is certainly not",
      "My sources say no",
      "My sources say yes",
      "I am unsure currently",
      "The answer is foggy",
    ][Math.floor(Math.random() * 10)] + ". - 8 Ball\n";
  }).replace(/\/dice/g, function() {
    return Math.ceil(Math.random() * 6) + " - Dice\n";
  }).substring(0, 504);
}

function modify(m) {
  for (n in cmds) {
    if (n % 2 === 0) {
      let h = new RegExp(cmds[n], "g");
      m = m.replace(h, cmds[Number(n) + 1]);
    }
  }
  return m;
}

function docRef() {
  return firestore.doc("data/" + auth.currentUser.email);
}

function chatClearAll(x) {
  for (i in x) {
    let temp = [auth.currentUser.email, x[i]].sort().join('"');
    var ref = firestore.doc("singles/" + temp);
    if (doc.id.split('"')[0] === auth.currentUser.email) {
      var re = "r0";
      var nre = "r1";
    } else {
      var re = "r1";
      var nre = "r0";
    }
    var obj = {data: []};
    obj[re] = new Date();
    obj[nre] = "Never";
    ref.update(obj).catch(function(error) {
      console.log(error);
    });
  }
  if (!isMobile) {
    selftext.select();
  }
}

function reauth(x) {
  var p = prompt("To reauthenticate, please enter your password.");
  if (p != "" && p != undefined) {
    var credentials = firebase.auth.EmailAuthProvider.credential(auth.currentUser.email, p);
    auth.currentUser.reauthenticateWithCredential(credentials).then(function() {
      alert("Reauthentication successful!");
      x();
    }).catch(function(error) {
      alert(error);
    });
  }
}

function getDate(d) {
  var mo = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][d.getMonth()] + " ";
  var hr = d.getHours();
  var min = d.getMinutes();
  if (min < 10) {
    min = "0" + min;
  }
  if (hr > 12) {
    hr -= 12;
    min += " P.M.";
  } else {
    min += " A.M.";
  }
  var wd = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d.getDay()] + ", ";
  return wd + mo + d.getDate() + ", " + hr + ":" + min;
}

function urlify(x, n) {
  var m = x.replace(/(https?:\/\/[^\s]+)/g, function(y) {
    var s = y.substring(y.length - 4, y.length);
    let v = y.split("<br>");
    let str = "";
    for (num in v) {
      if (num > 0) {
        str += "<br>" + v[num];
      }
    }
    if (s === ".jpg" || s === ".png" || s === "jpeg" || s === ".gif") {
      return `<br><img height="300" onload="imageOnload(this);" onError="imageError(this, ` + n + `);" src="` + encodeURI(v[0]) + `"><br>` + str;
    } else {
      return '<a onclick="if(!isMobile){selftext.select();}" target="_blank" href="' + encodeURI(v[0]) + '">' + v[0] + '</a>' + str;
    }
  }).replace(/  /g, "&nbsp;&nbsp;");
  if (m[0] === " ") {
    m = m.replace(" ", "&nbsp;");
  }
  return modify(m);
}

function imageOnload(x) {
  if (x.width > 800) {
    x.style.display = "none";
    x.width = 800;
    x.height = false;
    if (x.height === 0) {
      x.height = 300;
    }
    x.style.display = "";
    chatArea.scrollTop = chatArea.scrollHeight;
  }
}

function imageError(x, n) {
  chatArea.scrollTop = chatArea.scrollHeight;
  var sel = document.querySelector(".selected").innerHTML + "@r.ax";
  var temp = firestore.doc("singles/" + [auth.currentUser.email, sel].sort().join('"'));
  temp.get().then(function(doc) {
    var g = doc.data().data;
    g[n].data = CryptoJS.AES.encrypt(CryptoJS.AES.decrypt(g[n].data, hashes[sel]).toString(CryptoJS.enc.Utf8).replace(/(https?:\/\/[^\s]+)/g, function(y) {
      return y += "#";
    }), hashes[sel]).toString();
    temp.update({
      data: g
    }).catch(function(e) {
      console.log(e);
    });
  }).catch(function(e) {
    console.log(e);
  });
}

function orderString(x) {
  var list = [];
  for (y in x) {
    list.push(Object.keys(x[y]).sort().reduce(
      (obj, key) => { 
        obj[key] = x[y][key]; 
        return obj;
      },
    {}));
  }
  return JSON.stringify(list);
}