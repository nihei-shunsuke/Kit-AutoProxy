// ------------------------------------------------------------- //
//                                                               //
//    Automatic Proxy Configuration in KIT KTC and eagle-net     //
//                                               mod. 2019.11.25 //
// ------------------------------------------------------------- //

var os = require("os");

function myIpAddress() {
  var ifacesObj = {};
  ifacesObj.ipv4 = [];
  ifacesObj.ipv6 = [];
  var interfaces = os.networkInterfaces();

  for (var dev in interfaces) {
    interfaces[dev].forEach(function (details) {
      if (!details.internal) {
        switch (details.family) {
          case "IPv4":
            ifacesObj.ipv4.push({ name: dev, address: details.address });
            break;
          case "IPv6":
            ifacesObj.ipv6.push({ name: dev, address: details.address });
            break;
        }
      }
    });
  }
  let address = ifacesObj.ipv4[0]?.address
  if (ifacesObj.ipv4.length >= 2){
    address = ifacesObj.ipv4.filter(v=>v.name.startsWith("utun"))?.[0].address
  }

  return address;
}

function FindProxyForURL(url, host) {
  if (host == null || myIpAddress() == null) {
    return "DIRECT";
  }
  // where am i ???  under private broadband router????
  if (isInNet(myIpAddress(), "192.168.0.0", "255.255.255.0")) return "DIRECT";
  if (isInNet(myIpAddress(), "192.168.1.0", "255.255.255.0")) return "DIRECT";
  if (isInNet(myIpAddress(), "192.168.11.0", "255.255.255.0")) return "DIRECT";
  if (isInNet(myIpAddress(), "192.168.17.0", "255.255.255.0")) return "DIRECT";
  if (isInNet(myIpAddress(), "192.168.24.0", "255.255.255.0")) return "DIRECT";
  if (isInNet(myIpAddress(), "192.168.255.0", "255.255.255.0")) return "DIRECT";

  // I am in eagle-net ....
  if (isInNet(myIpAddress(), "172.26.0.0", "255.255.0.0")) return "DIRECT";
  if (isInNet(myIpAddress(), "172.27.0.0", "255.255.0.0")) return "DIRECT";
  if (isInNet(myIpAddress(), "172.31.0.0", "255.255.0.0")) return "DIRECT";

  // I am in ikenodaira to 61segment
  if (
    isInNet(myIpAddress(), "172.30.192.0", "255.255.252.0") &&
    isInNet(host, "61.120.101.0", "255.255.255.0")
  ) {
    return "PROXY wwwproxy-a10.kanazawa-it.ac.jp:8080";
  }

  // where am i ???  in known zone ???
  if (
    isInNet(myIpAddress(), "202.13.160.0", "255.255.240.0") /* KIT */ ||
    isInNet(myIpAddress(), "202.223.148.0", "255.255.254.0") /* KTC */ ||
    isInNet(myIpAddress(), "192.244.78.0", "255.255.254.0") /* TOK */ ||
    isInNet(myIpAddress(), "10.0.0.0", "255.0.0.0") /* prv */ ||
    isInNet(myIpAddress(), "172.16.0.0", "255.240.0.0") /* prv */ ||
    isInNet(myIpAddress(), "192.168.0.0", "255.255.0.0") /* prv */ ||
    isInNet(myIpAddress(), "169.254.0.0", "255.255.0.0") /* prv */
  ) {
    // I am in KIT/KTC zone....

    //   connect to me ??
    if (host == "127.0.0.1" || host == "localhost") return "DIRECT";

    ////////  Special settings ////////////////
    //  busmgt.ihc.kanazawa-it.ac.jp (HTNet) closed:2018/03/31
    // if ( shExpMatch(host, "busmgt.ihc.kanazawa-it.ac.jp" ) )   return "PROXY wwwproxy-a10.kanazawa-it.ac.jp:8080";
    if (shExpMatch(host, "manaba.ict-kanazawa.ac.jp"))
      return "PROXY wwwproxy-a10.kanazawa-it.ac.jp:8080";
    //  linkit.kanazawa-it.ac.jp 2020/03/17
    if (shExpMatch(host, "linkit.kanazawa-it.ac.jp"))
      return "PROXY wwwproxy-a10.kanazawa-it.ac.jp:8080";

    //   target is local domain.  use DIRECT connection
    if (shExpMatch(host, "*.kanazawa-it.ac.jp")) return "DIRECT";
    if (shExpMatch(host, "*.ict-kanazawa.ac.jp")) return "DIRECT";
    if (shExpMatch(host, "*.kanazawa-tc.ac.jp")) return "DIRECT";
    if (shExpMatch(host, "*.kitnet.jp")) return "DIRECT";
    if (shExpMatch(host, "*.eagle-net.ne.jp")) return "DIRECT";
    if (shExpMatch(host, "*.eagle-net.jp")) return "DIRECT";
    if (shExpMatch(host, "10.*")) return "DIRECT";
    if (shExpMatch(host, "172.16.*")) return "DIRECT";
    if (shExpMatch(host, "172.17.*")) return "DIRECT";
    if (shExpMatch(host, "172.18.*")) return "DIRECT";
    if (shExpMatch(host, "172.20.*")) return "DIRECT";
    if (shExpMatch(host, "172.24.*")) return "DIRECT";
    if (shExpMatch(host, "172.26.*")) return "DIRECT";
    if (shExpMatch(host, "172.27.*")) return "DIRECT";
    if (shExpMatch(host, "172.30.*")) return "DIRECT";
    if (shExpMatch(host, "192.168.*")) return "DIRECT";
    if (shExpMatch(host, "iogate2")) return "DIRECT";

    //  I am in KIT/KTC zone...
    return "PROXY wwwproxy-a10.kanazawa-it.ac.jp:8080";
  }

  // I am not in KIT/KTC  zone...
  return "DIRECT";
}

function convert_addr(ipchars) {
  var bytes = ipchars.split(".");
  var result =
    ((bytes[0] & 0xff) << 24) |
    ((bytes[1] & 0xff) << 16) |
    ((bytes[2] & 0xff) << 8) |
    (bytes[3] & 0xff);
  return result;
}
function dateRange() {
  function getMonth(name) {
    if (name in months) {
      return months[name];
    }
    return -1;
  }
  var date = new Date();
  var argc = arguments.length;
  if (argc < 1) {
    return false;
  }
  var isGMT = arguments[argc - 1] == "GMT";

  if (isGMT) {
    argc--;
  }
  // function will work even without explict handling of this case
  if (argc == 1) {
    var tmp = parseInt(arguments[0]);
    if (isNaN(tmp)) {
      return (
        (isGMT ? date.getUTCMonth() : date.getMonth()) == getMonth(arguments[0])
      );
    } else if (tmp < 32) {
      return (isGMT ? date.getUTCDate() : date.getDate()) == tmp;
    } else {
      return (isGMT ? date.getUTCFullYear() : date.getFullYear()) == tmp;
    }
  }
  var year = date.getFullYear();
  var date1, date2;
  date1 = new Date(year, 0, 1, 0, 0, 0);
  date2 = new Date(year, 11, 31, 23, 59, 59);
  var adjustMonth = false;
  for (var i = 0; i < argc >> 1; i++) {
    var tmp = parseInt(arguments[i]);
    if (isNaN(tmp)) {
      var mon = getMonth(arguments[i]);
      date1.setMonth(mon);
    } else if (tmp < 32) {
      adjustMonth = argc <= 2;
      date1.setDate(tmp);
    } else {
      date1.setFullYear(tmp);
    }
  }
  for (var i = argc >> 1; i < argc; i++) {
    var tmp = parseInt(arguments[i]);
    if (isNaN(tmp)) {
      var mon = getMonth(arguments[i]);
      date2.setMonth(mon);
    } else if (tmp < 32) {
      date2.setDate(tmp);
    } else {
      date2.setFullYear(tmp);
    }
  }
  if (adjustMonth) {
    date1.setMonth(date.getMonth());
    date2.setMonth(date.getMonth());
  }
  if (isGMT) {
    var tmp = date;
    tmp.setFullYear(date.getUTCFullYear());
    tmp.setMonth(date.getUTCMonth());
    tmp.setDate(date.getUTCDate());
    tmp.setHours(date.getUTCHours());
    tmp.setMinutes(date.getUTCMinutes());
    tmp.setSeconds(date.getUTCSeconds());
    date = tmp;
  }
  return date1 <= date && date <= date2;
}
function dnsDomainIs(host, domain) {
  return (
    host.length >= domain.length &&
    host.substring(host.length - domain.length) == domain
  );
}
function dnsDomainLevels(host) {
  return host.split(".").length - 1;
}
function isInNet(ipaddr, pattern, maskstr) {
  var test = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(ipaddr);
  if (test == null) {
    ipaddr = dnsResolve(ipaddr);
    if (ipaddr == null) return false;
  } else if (test[1] > 255 || test[2] > 255 || test[3] > 255 || test[4] > 255) {
    return false; // not an IP address
  }
  var host = convert_addr(ipaddr);
  var pat = convert_addr(pattern);
  var mask = convert_addr(maskstr);
  return (host & mask) == (pat & mask);
}
function isResolvable(host) {
  var ip = dnsResolve(host);
  return ip != null;
}
function isResolvableEx(host) {
  var ipList = dnsResolveEx(host);
  return ipList != "";
}
function localHostOrDomainIs(host, hostdom) {
  return host == hostdom || hostdom.lastIndexOf(host + ".", 0) == 0;
}
function shExpMatch(url, pattern) {
  pattern = pattern.replace(/\./g, "\\.");
  pattern = pattern.replace(/\*/g, ".*");
  pattern = pattern.replace(/\?/g, ".");
  var newRe = new RegExp("^" + pattern + "$");
  return newRe.test(url);
}
function timeRange() {
  var argc = arguments.length;
  var date = new Date();
  var isGMT = false;

  if (argc < 1) {
    return false;
  }
  if (arguments[argc - 1] == "GMT") {
    isGMT = true;
    argc--;
  }

  var hour = isGMT ? date.getUTCHours() : date.getHours();
  var date1, date2;
  date1 = new Date();
  date2 = new Date();

  if (argc == 1) {
    return hour == arguments[0];
  } else if (argc == 2) {
    return arguments[0] <= hour && hour <= arguments[1];
  } else {
    switch (argc) {
      case 6:
        date1.setSeconds(arguments[2]);
        date2.setSeconds(arguments[5]);
      case 4:
        var middle = argc >> 1;
        date1.setHours(arguments[0]);
        date1.setMinutes(arguments[1]);
        date2.setHours(arguments[middle]);
        date2.setMinutes(arguments[middle + 1]);
        if (middle == 2) {
          date2.setSeconds(59);
        }
        break;
      default:
        throw "timeRange: bad number of arguments";
    }
  }

  if (isGMT) {
    date.setFullYear(date.getUTCFullYear());
    date.setMonth(date.getUTCMonth());
    date.setDate(date.getUTCDate());
    date.setHours(date.getUTCHours());
    date.setMinutes(date.getUTCMinutes());
    date.setSeconds(date.getUTCSeconds());
  }
  return date1 <= date && date <= date2;
}
function weekdayRange() {
  function getDay(weekday) {
    if (weekday in wdays) {
      return wdays[weekday];
    }
    return -1;
  }
  var date = new Date();
  var argc = arguments.length;
  var wday;
  if (argc < 1) return false;
  if (arguments[argc - 1] == "GMT") {
    argc--;
    wday = date.getUTCDay();
  } else {
    wday = date.getDay();
  }
  var wd1 = getDay(arguments[0]);
  var wd2 = argc == 2 ? getDay(arguments[1]) : wd1;
  return wd1 == -1 || wd2 == -1 ? false : wd1 <= wday && wday <= wd2;
}

let result = FindProxyForURL("", os.hostname());
if (result !== "DIRECT") {
  process.exit(0);
} else {
  process.exit(1);
}