for (x in cmds) {
  if (x % 2 === 0) {
    let p = cmdDiv.appendChild(document.createElement("p"));
    p.innerHTML = "<span>" + cmds[x] + " - </span>" + cmds[Number(x) + 1];
  }
}
auth.onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    banUpdates = firestore.doc("admin/admin").onSnapshot(
      function(doc) {
        banDiv.innerHTML = "";
        banNames = doc.data().banList;
        if (banNames.includes(auth.currentUser.email)) {
          if (!isBanned) {
            isBanned = true;
            if (Notification.permission === 'granted') {
              new Notification("Account Ban", {
                icon: 'resources/favicon.svg',
                body: "Your account has been banned."
              }).onclick = function() {
                this.close();
              };
            }
            ree.innerHTML = "";
            chatArea.innerHTML = "";
            read.innerHTML = "Last read by other person: Never";
            alert("Your account has been banned.");
          }
        } else {
          if (isBanned) {
            if (Notification.permission === 'granted') {
              new Notification("Account Unban", {
                icon: 'resources/favicon.svg',
                body: "Your account has been unbanned!"
              }).onclick = function() {
                this.close();
              };
            }
            alert("Your account has been unbanned! The page will reload shortly.");
            setTimeout(function() {
              location.reload();
            }, 3000);
          }
        }
        for (x in banNames) {
          let p = banDiv.appendChild(document.createElement("P"));
          p.innerHTML = banNames[x].substring(0, banNames[x].length - 5);
        }
      }
    );
    user.innerHTML = firebaseUser.email.substring(0, firebaseUser.email.length - 5);
    content.style.display = "inline";
    login.style.display = "none";
    options.style.display = "inline";
    clearChat.style.display = "inline";
    volume.style.display = "inline";
    stat.style.display = "inline";
    rgo.style.display = "inline";
    docRef().update({
      online: true
    }).catch(function(e) {
      console.log(e);
    });
    if (location.protocol === "http:" && nonce === 0) {
      nonce = 1;
      if (confirm("Swap to https?")) {
        docRef().update({
          online: false
        }).catch(function(error) {
          console.log(error);
        });
        location.href = location.href.replace("tp", "tps");
      }
    }
    getRealtimeUpdates3 = docRef().onSnapshot(
      function(doc) {
        if (doc && doc.exists) {
          if (doc.data().hash != bigInt(3).modPow(bigInt(localStorage.passwordHashed, 16), bigInt(moduloN)).toString()) {
            logout();
          }
          if (doc.data().online) {
            rgo.className = "g";
            stat.innerHTML = "Online&nbsp;";
          } else {
            rgo.className = "r";
            stat.innerHTML = "Offline&nbsp;";
          }
          let data = doc.data();
          blockedUsers = data.blocked;
          blockList.innerHTML = "";
          for (n in data.blocked) {
            let p = blockList.appendChild(document.createElement("P"));
            p.innerHTML = data.blocked[n].substring(0, data.blocked[n].length - 5);
          }
          for (n in data.contacts) {
            if (data.blocked.includes(data.contacts[n] + "@r.ax")) {
              docRef().update({
                contacts: firebase.firestore.FieldValue.arrayRemove(data.contacts[n])
              }).then(function() {
                if (rDC.style.opacity === "1") {
                  requests();
                  requests();
                }
              }).catch(function(e) {
                console.log(e);
              });
            }
          }
          if (JSON.stringify(Contacts) === JSON.stringify(data.contacts)) {
            return;
          }
          for (n in onlines) {
            onlines[n]();
          }
          onlines = {}
          for (n in notifs) {
            notifs[n]();
          }
          hashes = {};
          notifs = {};
          Contacts = data.contacts;
          ree.innerHTML = "";
          for (n in Contacts) {
            onlines[Contacts[n]] = firestore.doc("data/" + Contacts[n] + "@r.ax").onSnapshot(
              function(doc) {
                if (doc.exists) {
                  var but = document.querySelector("BUTTON[name=" + doc.id.substring(0, doc.id.length - 5) + "]");
                  but.classList.remove("online");
                  but.classList.remove("offline");
                  if (doc.data().online) {
                    but.classList.add("online");
                  } else {
                    but.classList.add("offline");
                  }
                  hashes[doc.id] = bigInt(doc.data().hash).modPow(bigInt(localStorage.passwordHashed, 16), bigInt(moduloN)).toString();
                  if (doc.data().blocked && doc.data().blocked.includes(auth.currentUser.email)) {
                    docRef().update({
                      contacts: firebase.firestore.FieldValue.arrayRemove(doc.id.substring(0, doc.id.length - 5))
                    }).then(function() {
                      if (rDC.style.opacity === "1") {
                        requests();
                        requests();
                      }
                      alert("A user blocked you, so we are removing them from your contacts.");
                    }).catch(function(e) {
                      console.log(e);
                    });
                  }
                } else {
                  docRef().update({
                    contacts: firebase.firestore.FieldValue.arrayRemove(doc.id.substring(0, doc.id.length - 5))
                  }).catch(function(error) {
                    console.log(error);
                  });
                  onlines[doc.id.substring(0, doc.id.length - 5)]();
                  delete hashes[doc.id];
                }
                if (!document.querySelector(".selected")) {
                  document.querySelector(".unselected").click();
                }
              });
            notifs[Contacts[n]] = firestore.doc("singles/" + [auth.currentUser.email, Contacts[n] + "@r.ax"].sort().join('"')).onSnapshot(
              function(doc) {
                if (doc.exists && doc.data().data != []) {
                  let edata = doc.data().data;
                  var tempName = doc.id.split('"')[edata[edata.length - 1].user];
                  if (doc.id.split('"')[0] != auth.currentUser.email) {
                    var notYourName = doc.id.split('"')[0].substring(0, doc.id.split('"')[0].length - 5);
                    var io = "1";
                  } else {
                    var notYourName = doc.id.split('"')[1].substring(0, doc.id.split('"')[1].length - 5);
                    var io = "0";
                  }
                  var btn = document.querySelector("button[name=" + notYourName + "]");
                  if (doc.data()["r" + io] != "Never") {
                    btn.style.color = "whitesmoke";
                    btn.style.fontWeight = "";
                  } else {
                    btn.style.color = "#aaf";
                    btn.style.fontWeight = "bold";
                  }
                  if ((notYourName != document.querySelector(".selected").innerHTML || !document.hasFocus()) && doc.data()["r" + io] === "Never" && tempName != auth.currentUser.email && JSON.stringify(oldConvos[doc.id]) != JSON.stringify(edata)) {
                    if (Notification.permission === 'granted' && notifCheck.checked) {
                      var img = null;
                      if (!edata[edata.length - 1].data.includes(":")) {
                        var m = CryptoJS.AES.decrypt(edata[edata.length - 1].data, hashes[notYourName + "@r.ax"]).toString(CryptoJS.enc.Utf8).replace(/(https?:\/\/[^\s]+)/g, function(y) {
                          var s = y.substring(y.length - 4, y.length);
                          if (s === ".jpg" || s === ".png" || s === "jpeg" || s === ".gif") {
                            img = y;
                            return ` [Image] `;
                          } else {
                            return y;
                          }
                        });
                      } else {
                        var m = "[File]";
                      }
                      var a = new Notification(tempName.substring(0, tempName.length - 5), {
                        icon: img ? img: undefined,
                        body: modify(m)
                      });
                      currentNotifs.push(a);
                      a.onclick = function() {
                        for (x in currentNotifs) {
                          currentNotifs[x].close();
                        }
                        setTimeout(function() {
                          for (x in currentNotifs) {
                            currentNotifs[x].close();
                          }
                          currentNotifs = [];
                        }, 1000);
                        window.focus();
                        document.querySelector("button[name=" + notYourName + "]").click();
                        a.close();
                      }
                    }
                    if (soundCheck.checked) {
                      audio.currentTime = 0;
                      audio.play();
                    }
                  }
                  oldConvos[doc.id] = edata;
                }
              });
            var newButton = ree.appendChild(document.createElement("button"));
            newButton.innerHTML = Contacts[n];
            newButton.name = Contacts[n];
            newButton.classList.add("unselected");
            newButton.classList.add("offline");
            newButton.onclick = function(e) {
              for (x in ree.children) {
                if (typeof ree.children[x] === "object") {
                  ree.children[x].classList.remove("selected");
                  ree.children[x].classList.add("unselected");
                  ree.children[x].disabled = false;
                }
              }
              e.target.classList.remove("unselected");
              e.target.classList.add("selected");
              e.target.disabled = true;
              if (!isMobile) {
                selftext.select();
              }
              get();
            };
          }
        }
      }
    );
  } else {
    if (location.protocol === "http:" && nonce === 0) {
      nonce = 1;
      if (confirm("Swap to https?")) {
        location.href = "https" + location.href.replace("http", "");
      }
    }
    oldData = "";
    user.innerHTML = "";
    content.style.display = "none";
    login.style.display = "inline";
    options.style.display = "none";
    clearChat.style.display = "none";
    volume.style.display = "none";
    stat.style.display = "none";
    rgo.style.display = "none";
    selftext.value = "";
    chatArea.innerHTML = "";
    read.innerHTML = "Last read by other person: Never";
    localStorage.passwordHashed = "";
    try {
      getRealtimeUpdates2();
    } catch {}
    try {
      getRealtimeUpdates3();
    } catch {}
    try {
      banUpdates();
    } catch {}
    for (n in onlines) {
      onlines[n]();
    }
    onlines = {};
    hashes = {};
    for (n in notifs) {
      notifs[n]();
    }
    notifs = {};
  }
  load.style.display = "none";
  document.body.style.display = "inline";
});
if (Notification) {
  if (Notification.permission != 'granted') {
    Notification.requestPermission();
  } else {
    notifCheck.disabled = false;
    notifCheck.checked = true;
  }
}
selftext.onkeypress = function(e) {
  if (!e.shiftKey && e.keyCode === 13) {
    e.preventDefault();
    stuff();
  }
}
document.querySelector("#password").onkeypress = function(e) {
  if (e.keyCode === 13) {
    signin();
  }
};
document.querySelector("#username").onkeypress = function(e) {
  if (e.keyCode === 13) {
    document.querySelector("#password").select();
  }
};
window.addEventListener("beforeunload", function() {
  if (auth.currentUser) {
    docRef().update({
      online: false
    }).catch(function(error) {
      console.log(error);
    });
  }
  for (x in currentNotifs) {
    currentNotifs[x].close();
  }
});
window.addEventListener("focus", function() {
  for (x in currentNotifs) {
    currentNotifs[x].close();
  }
  setTimeout(function() {
    for (x in currentNotifs) {
      currentNotifs[x].close();
    }
    currentNotifs = [];
  }, 1000);
  var sel = document.querySelector(".selected");
  if (!sel) {
    return;
  }
  firestore.doc("singles/" + [auth.currentUser.email, sel.innerHTML + "@r.ax"].sort().join('"')).get().then(function(doc) {
    if (doc.id.split('"')[0] === auth.currentUser.email) {
      var re = "r0";
    } else {
      var re = "r1";
    }
    if (doc.data()[re] === "Never") {
      var obj = {};
      obj[re] = new Date();
      firestore.doc("singles/" + doc.id).update(obj).catch(function(e) {
        console.log(e);
      });
    }
  }).catch(function(e) {
    console.log(e);
  });
});
user.onclick = function() {
  if (confirm("Would you like to copy your username?")) {
    var t = document.body.appendChild(document.createElement("textarea"));
    t.value = user.innerHTML;
    t.select();
    document.execCommand("copy");
    t.remove();
  }
  if (!isMobile) {
    selftext.select();
  }
}