function stuff(e) {
  if (!e) {
    var txt = selftext.value.replace(/\s*$/, ""); 
    if (txt.trim() === "") {
      return;
    }
    if (txt.trim() === "/banlist") {
      bans.style.opacity = "1";
      bans.style.pointerEvents = "";
      gray.style.opacity = ".75";
      gray.style.pointerEvents = "";
      selftext.value = "";
      selftext.blur();
      return;
    } else if (txt.trim() === "/cmds") {
      help();
      selftext.value = "";
      selftext.blur();
      return;
    } else if (txt.trim() === "/blocked") {
      blocks.style.opacity = "1";
      blocks.style.pointerEvents = "";
      gray.style.opacity = ".75";
      gray.style.pointerEvents = "";
      document.querySelector("#blockMenu input").select();
      selftext.value = "";
      return;
    } else if (txt.trim() === "/tutorial") {
      selftext.value = "";
      window.open("resources/tutorial.jpg");
      return;
    }
    if (!timer2) {
      alert("You can only send a message every second!");
      return;
    } else {
      timer2 = false;
      spinner.classList.add("spin");
      setTimeout(function() {
        spinner.classList.remove("spin");
        timer2 = true;
      }, 1000);
    }
    selftext.value = "";
    if (auth.currentUser.email === "admin@r.ax") {
      if (txt.substring(0, 5) === "/ban ") {
        firestore.doc("admin/admin").update({
          banList: firebase.firestore.FieldValue.arrayUnion(txt.substring(5, txt.length).toLowerCase() + "@r.ax")
        }).then(function() {
          alert("Ban list updated!");
        }).catch(function(e) {
          alert(e);
        });
        return;
      } else if (txt.substring(0, 7) === "/unban ") {
        firestore.doc("admin/admin").update({
          banList: firebase.firestore.FieldValue.arrayRemove(txt.substring(7, txt.length).toLowerCase() + "@r.ax")
        }).then(function() {
          alert("Ban list updated!");
        }).catch(function(e) {
          alert(e);
        });
        return;
      }
    }
  }
  var sel = document.querySelector(".selected").innerHTML + "@r.ax";
  var temp = [auth.currentUser.email, sel].sort().join('"');
  if (temp.split('"')[0] === auth.currentUser.email) {
    var userN = 0;
  } else {
    var userN = 1;
  }
  var ref = firestore.doc("singles/" + temp);
  ref.get().then(function(doc) {
    if (userN) {
      var re = "r1";
      var nre = "r0";
    } else {
      var re = "r0";
      var nre = "r1";
    }
    if (doc.exists) {
      let data = doc.data().data;
      if (Array.isArray(data) && data.length > 100) {
        ref.update({
          data: data.splice(49, 60)
        }).catch(function(e) {
          alert(e);
        });
      }
      if (e) {
        for (x in data) {
          if (data[x].data.includes("data:")) {
            ref.update({
              data: firebase.firestore.FieldValue.arrayRemove(data[x])
            }).catch(function(e) {
              console.log(e);
            });
          }
        }
        var dat = e;
      } else {
        var dat = CryptoJS.AES.encrypt(change(txt), hashes[sel]).toString();
      }
      var obj = {
        data: firebase.firestore.FieldValue.arrayUnion({
          user: userN,
          date: new Date(),
          data: dat
        })
      };
      obj[re] = new Date();
      obj[nre] = "Never";
      ref.update(obj).catch(function(error) {
        alert(error);
      });
    } else {
      var obj = {
        data: [{
          user: userN,
          date: new Date(),
          data: CryptoJS.AES.encrypt(change(txt), hashes[sel]).toString()
        }]
      };
      obj[re] = new Date();
      obj[nre] = "Never";
      ref.set(obj).catch(function(error) {
        alert(error);
      });
      if (!isMobile) {
        selftext.select();
      }
    }
  }).catch(function(error) {
    console.log(error);
  });
}

function get() {
  if (!document.querySelector(".selected")) {
    chatArea.innerHTML = "";
    read.innerHTML = "Read by other person: Never";
    oldData = "[]";
    return;
  }
  try {
    getRealtimeUpdates2();
  } catch {}
  var user2 = document.querySelector(".selected").innerHTML;
  var temp = [auth.currentUser.email, user2 + "@r.ax"].sort().join('"');
  getRealtimeUpdates2 = firestore.doc("singles/" + temp).onSnapshot(
    function(doc) {
      if (!doc.exists) {
        chatArea.innerHTML = "";
        read.innerHTML = "Read by other person: Never";
        oldData = "[]";
        return;
      }
      if (doc.exists && (orderString(doc.data().data) != oldData || JSON.stringify(doc.data().data) === "[]")) {
        chatArea.innerHTML = "";
        var pastName = "";
        var tempArray = doc.id.split('"');
        let data = doc.data().data;
        try {
        for (i in data) {
          let x = chatArea.appendChild(document.createElement("DIV"));
          x.className = "chatBox";
          if (tempArray[data[i].user] != pastName) {
            let name = x.appendChild(document.createElement("P"));
            name.className = "name";
            name.innerHTML = tempArray[data[i].user].substring(0, tempArray[data[i].user].length - 5);
            name.onclick = function() {
              if (confirm("Would you like to copy this username?")) {
                var t = document.body.appendChild(document.createElement("input"));
                t.value = name.innerHTML;
                t.select();
                document.execCommand("copy");
                t.remove();
              }
              if (!isMobile) {
                selftext.select();
              }
            }
            pastName = tempArray[data[i].user];
          }
          if (data[i].data.substring(0, 5) != "data:") {
            var y = x.appendChild(document.createElement("P"));
            let dat = CryptoJS.AES.decrypt(data[i].data, hashes[user2 + "@r.ax"]).toString(CryptoJS.enc.Utf8).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\n/g, "<br>");
            y.innerHTML = urlify(dat, i);
          } else {
            var y = x.appendChild(document.createElement("DIV"));
            x.style.paddingTop = "10px";
            x.style.paddingBottom = "10px";
            var num = Number(data[i].data.split(":")[3]);
            if (num < 1000) {
              num = num + " bytes";
            } else if (num < 100000) {
              num = (num / 1000).toString().substring(0, 4) + " kilobytes";
            } else {
              num = (num / 1000).toString().substring(0, 3) + " kilobytes";
            }
            y.innerHTML = data[i].data.split(":")[2].replace(/&/g, "&amp;").replace(/</g, "&lt;") + "<br><span>" + num + "</span><br>";
            var z = y.appendChild(document.createElement("A"));
            z.href = "data:" + CryptoJS.AES.decrypt(data[i].data.split(":")[1], hashes[user2 + "@r.ax"]).toString(CryptoJS.enc.Utf8);
            z.download = data[i].data.split(":")[2];
            z.innerHTML = "<button>Download</button>";
          }
          y.title = getDate(data[i].date.toDate());
        }
        } catch (error) {
          chatClear();
          alert("Something went wrong so we cleared your chat to fix it.\nError:" + error);
        }
        chatArea.scrollTop = chatArea.scrollHeight;
        oldData = orderString(data);
      }
      if (doc.id.split('"')[0] === auth.currentUser.email) {
        var re = "r0";
        var nre = "r1";
      } else {
        var re = "r1";
        var nre = "r0";
      }
      if (doc.exists && document.hasFocus()) {
        if (doc.data()[re] === "Never") {
          var obj = {};
          obj[re] = new Date();
          firestore.doc("singles/" + doc.id).update(obj).catch(function(e) {
            console.log(e);
          });
        }
        if (typeof doc.data()[nre] === "object") {
          read.innerHTML = "Read by other person: " + getDate(doc.data()[nre].toDate());
        } else {
          read.innerHTML = "Read by other person: Never";
        }
      }
    });
}

function changeVolume() {
  let p = prompt("What volume would you like the ping to be? It is currently " + audio.volume * 100 + " on a scale of 0 - 100.");
  if (!isNaN(p) && p != "") {
    if (Number(p) > 100) {
      p = 100;
    }
    if (Number(p) < 0) {
      p = 0;
    }
    audio.volume = Number(p) / 100;
  }
  if (!isMobile) {
    selftext.select();
  }
}

function deleteContact() {
  docRef().update({
    contacts: firebase.firestore.FieldValue.arrayRemove(document.querySelector(".selected").innerHTML)
  }).then(function() {
    if (rDC.style.opacity === "1") {
      requests();
      requests();
    }
  }).catch(function(e) {
    console.log(e);
  });
  if (!isMobile) {
    selftext.select();
  }
}

function signin() {
  var username = document.querySelector("#username").value.toLowerCase() + "@r.ax";
  var password = document.querySelector("#password").value;
  localStorage.passwordHashed = CryptoJS.SHA3(CryptoJS.PBKDF2(password, username, {iterations: 1000}).toString()).toString();
  var promise = auth.signInWithEmailAndPassword(username, password).then(function() {
    document.querySelector("#username").value = "";
    document.querySelector("#password").value = "";
  }).catch(function(error) {
    if (error.code === "auth/user-not-found") {
      if (confirm("User not found: Would you like to sign up?")) {
        signup();
      }
    } else {
      alert(error);
    }
  });
}

function signup() {
  var username = document.querySelector("#username").value.toLowerCase() + "@r.ax";
  var password = document.querySelector("#password").value;
  if (!username.includes('"') && username.length < 36) {
    auth.createUserWithEmailAndPassword(username, password).then(function() {
      localStorage.passwordHashed = CryptoJS.SHA3(CryptoJS.PBKDF2(password, username, {iterations: 1000}).toString()).toString();
      document.querySelector("#username").value = "";
      document.querySelector("#password").value = "";
      alert("User created!");
      docRef().set({
        hash: bigInt(3).modPow(bigInt(localStorage.passwordHashed, 16), bigInt(moduloN)).toString(),
        online: true,
        contacts: [],
        blocked: [],
        run: false
      }).catch(function(e) {
        console.log(e);
      });
    }).catch(function(error) {
      alert(error);
    });
  } else {
    alert("Account usernames cannot have quotation marks in them or be longer than 30 characters long.");
  }
}

function closeCmds() {
  menu.style.opacity = "0";
  menu.style.pointerEvents = "none";
  gray.style.opacity = "0";
  gray.style.pointerEvents = "none";
  if (!isMobile) {
    selftext.select();
  }
}

function closeBan() {
  bans.style.opacity = "0";
  bans.style.pointerEvents = "none";
  gray.style.opacity = "0";
  gray.style.pointerEvents = "none";
  if (!isMobile) {
    selftext.select();
  }
}

function closeBlock() {
  blocks.style.opacity = "0";
  blocks.style.pointerEvents = "none";
  gray.style.opacity = "0";
  gray.style.pointerEvents = "none";
  if (!isMobile) {
    selftext.select();
  }
}

function deleteAccount() {
  var com = prompt("If you really want to delete this account, type in your username, " + user.innerHTML).toLowerCase();
  if (com === user.innerHTML) {
    docRef().get().then(function(doc) {
      if (doc.exists) {
        var contacts = doc.data().contacts;
      } else {
        var contacts = [];
      }
      docRef().delete().then(function() {
        for (x in contacts) {
          firestore.doc("singles/" + [auth.currentUser.email, contacts[x] + "@r.ax"].sort().join('"')).delete().catch(function(error) {
            console.log(error);
          });
        }
        alert("Data wipe successful!");
        auth.currentUser.delete().then(function() {
          alert("Account deleted.");
        }).catch(function(error) {
          alert(error);
          if (error.code === "auth/requires-recent-login") {
            docRef().set({
              hash: bigInt(3).modPow(bigInt(localStorage.passwordHashed, 16), bigInt(moduloN)).toString(),
              online: true,
              contacts: [],
              blocked: [],
              run: false
            }).catch(function(e) {
              console.log(e);
            });
            reauth(deleteAccount);
          }
        });
      }).catch(function(error) {
        alert("Data wipe unsucessful. " + error);
      });
    }).catch(function(error) {
      alert(error);
    });
  } else if (com === "" || com === undefined) {
    return;
  } else {
    alert("Incorrect username, try again");
  }
}

function help() {
  menu.style.opacity = "1";
  menu.style.pointerEvents = "";
  gray.style.opacity = ".75";
  gray.style.pointerEvents = "";
  return;
}

function changePassword() {
  var p = prompt("What would you like your new password to be?");
  if (p != undefined && p != "") {
    var q = localStorage.passwordHashed;localStorage.passwordHashed = CryptoJS.SHA3(CryptoJS.PBKDF2(p, auth.currentUser.email, {iterations: 1000}).toString()).toString();
    auth.currentUser.updatePassword(p).then(function() {
      docRef().update({
        hash: bigInt(3).modPow(bigInt(bigInt(localStorage.passwordHashed, 16)), bigInt(moduloN)).toString()
      }).then(function() {
        let j = [];
        for (x in ree.children) {
          if (typeof ree.children[x] === "object") {
            j.push(ree.children[x].innerHTML + "@r.ax");
          }
        }
        chatClearAll(j);
        docRef().get().then(function(doc) {
          docRef().update({
            run: !doc.data().run
          }).then(function() {
            alert("Password change successful!");
          }).catch(function(e) {
            console.log(e);
          });
        }).catch(function(e) {
          console.log(e);
        });
      }).catch(function(e) {
        console.log(e);
      });
    }).catch(function(error) {
      localStorage.passwordHashed = q;
      alert(error);
      if (error.code === "auth/requires-recent-login") {
        reauth(changePassword);
      }
    });
  }
  if (!isMobile) {
    selftext.select();
  }
}

function add(x) {
  if (!x) {
    var x = prompt("Insert Username Of Person To Add").toLowerCase();
  }
  if (x === "" || x === undefined) {
    return;
  } else if (x + "@r.ax" === auth.currentUser.email) {
    alert("You can't add yourself.");
    return;
  } else if (x.includes('"')) {
    alert("Emails can't have quotation marks in them.");
    return;
  } else if (x.length > 35) {
    alert("Emails can't be that long.");
    return;
  }
  if (banNames.includes(x + "@r.ax")) {
    alert("This user is banned. You may not add them.");
    return;
  }
  firestore.doc("data/" + x + "@r.ax").get().then(function(doc) {
    if (doc.exists) {
      docRef().update({
        contacts: firebase.firestore.FieldValue.arrayUnion(x)
      }).then(function() {
        if (rDC.style.opacity === "1") {
          requests();
          requests();
        }
      }).catch(function(error) {
        console.log(error);
      });
    } else {
      alert("User doesn't exist.");
    }
  }).catch(function(error) {
    console.log(error);
  });
  if (!isMobile) {
    selftext.select();
  }
}

function chatClear() {
  let temp = [auth.currentUser.email, document.querySelector(".selected").innerHTML + "@r.ax"].sort().join('"');
  var ref = firestore.doc("singles/" + temp);
  if (temp.split('"')[0] === auth.currentUser.email) {
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
  if (!isMobile) {
    selftext.select();
  }
}

function logout() {
  docRef().update({
    online: false
  }).then(function() {
    auth.signOut();
  }).catch(function(e) {
    console.log(e);
    auth.signOut();
  });
}

function settings() {
  var u = prompt(`What would you like to do?
Change Password
Delete Account
Logout`).toLowerCase();
  if (u === "change password") {
    changePassword();
    if (!isMobile) {
      selftext.select();
    }
  } else if (u === "delete account") {
    deleteAccount();
  } else if (u === "logout") {
    logout();
  }
}

function swap() {
  if (timer) {
    timer = false;
    spinner.classList.add("spin");
    setTimeout(function() {
      spinner.classList.remove("spin");
      timer = true;
    }, 1000);
    if (rgo.className === "g") {
      docRef().update({
        online: false
      }).catch(function(e) {
        console.log(e);
      });
    } else {
      docRef().update({
        online: true
      }).catch(function(e) {
        console.log(e);
      });
    }
  } else {
    alert("Slow down! You can only change your status every second.");
  }
  if (!isMobile) {
    selftext.select();
  }
}

function upload() {
  var file = input.files[0];
  input.value = "";
  if (file.size > 200000) {
    var size = file.size;
    alert("Maximum file size is 200kB. Your file size is " + file.size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " bytes."); 
    return;
  }
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function() {
    stuff(reader.result.substring(0, 5) + CryptoJS.AES.encrypt(reader.result.substring(5, reader.result.length), hashes[document.querySelector(".selected").innerHTML + "@r.ax"]).toString() + ":" + file.name + ":" + file.size);
  };
  reader.onerror = function() {
    console.log(reader.error);
  };
  if (!isMobile) {
    selftext.select();
  }
}

function requests() {
  if (rDC.style.opacity === "0" && timer3) {
    timer3 = false;
    setTimeout(function() {
      timer3 = true;
    }, 1000);
    rDC.style.opacity = "1";
    rDC.style.pointerEvents = "";
    rD.innerHTML = "";
    firestore.collection("data").where("contacts", "array-contains", user.innerHTML).get().then(function(docs) {
      docs.forEach(function(doc) {
        var dId = doc.id.substring(0, doc.id.length - 5);
        if (!Contacts.includes(dId) && !blockedUsers.includes(dId + "@r.ax")) {
          var div = rD.appendChild(document.createElement("DIV"));
          div.innerHTML = dId;
          var check = div.appendChild(document.createElement("BUTTON"));
          check.className = "check";
          check.innerHTML = "O";
          check.onclick = function() {
            add(dId);
          };
          var x = div.appendChild(document.createElement("BUTTON"));
          x.className = "xReq";
          x.innerHTML = "X";
          x.onclick = function() {
            block(dId);
          }
        }
      });
    }).catch(function(e) {
      console.log(e);
    });
    return;
  } else if (!timer3) {
    alert("Slow down! You can't request your friends that quickly.");
  } else {
    rDC.style.opacity = "0";
    rDC.style.pointerEvents = "none";
    if (!isMobile) {
      selftext.select();
    }
    return;
  }
}

function closeG() {
  if (bans.style.opacity === "1") {
    closeBan();
    return;
  } else if (menu.style.opacity === "1") {
    closeCmds();
    return;
  } else if (blocks.style.opacity === "1") {
    closeBlock();
    return;
  }
}

function block(x) {
  firestore.doc("data/" + x.toLowerCase() + "@r.ax").get().then(function(doc) {
    if (doc.exists) {
      docRef().update({
        blocked: firebase.firestore.FieldValue.arrayUnion(x.toLowerCase() + "@r.ax")
      }).then(function() {
        binput.value = "";
        if (rDC.style.opacity === "1") {
          requests();
          requests();
        }
      }).catch(function(e) {
        console.log(e);
      });
    } else {
      binput.value = "";
      alert("This user does not exist.");
    }
  }).catch(function(e) {
    console.log(e);
  });
}

function unblock() {
  docRef().update({
    blocked: firebase.firestore.FieldValue.arrayRemove(binput.value.toLowerCase() + "@r.ax")
  }).then(function() {
    binput.value = "";
    if (rDC.style.opacity === "1") {
      requests();
      requests();
    }
  }).catch(function(e) {
    console.log(e);
  });
}