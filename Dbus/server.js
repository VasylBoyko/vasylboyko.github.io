var bus = dbus.sessionBus();
var name = 'org.mpris.MediaPlayer2.my_player';
bus.connection.on('message', function(msg) {
  console.log(msg)
/*msg: {
destination: ":1.597"
flags: 0
interface: "org.mpris.MediaPlayer2.Player"
member: "PlayPause"
path: "/org/mpris/MediaPlayer2"
sender: ":1.590"
serial: 1144
signature: ""
type:1
}*/
  if (msg.path === '/org/mpris/MediaPlayer2') {

	switch msg['interface'] {
		case 'org.mpris.MediaPlayer2.Player':
			if (app[msg.member])
			app

	}
  }
});
bus.requestName(name, 0);


function () {
    var reply = {
      type: dbus.messageType.methodReturn,
      destination: msg.sender,
      replySerial: msg.serial,
      sender: name,
      signature: 's',
      body: [
        msg.body[0]
          .split('')
          .reverse()
          .join('')
      ]
    };
    bus.invoke(reply);
}

function App () {
/*
//https://specifications.freedesktop.org/mpris-spec/latest/Media_Player.html
	
//	Methods
	Raise	()	→	nothing	
	Quit	()	→	nothing	
//	Properties
	CanQuit	b	Read only		
	Fullscreen	b	Read/Write		(optional)
	CanSetFullscreen	b	Read only		(optional)
	CanRaise	b	Read only		
	HasTrackList	b	Read only		
	Identity	s	Read only		
	DesktopEntry	s	Read only		(optional)
	SupportedUriSchemes	as	Read only		
	SupportedMimeTypes	as	Read only		
*/
return {
	Raise: function () {console.log("TODO: Raise")},
	Quit: function () {console.log("TODO: Quit")},
//	Properties
	CanQuit	b	Read only		
	Fullscreen	b	Read/Write		(optional)
	CanSetFullscreen	b	Read only		(optional)
	CanRaise	b	Read only		
	HasTrackList	b	Read only		
	Identity	s	Read only		
	DesktopEntry	s	Read only		(optional)
	SupportedUriSchemes	as	Read only		
	SupportedMimeTypes	as	Read only
}

function Player() {
	
}
function TrackList {

}
function Playlists

























/*


D-Bus specification; you can implement it on your class just like you implement any other D-Bus interface:

# Untested, just off the top of my head

import dbus

MY_INTERFACE = 'com.example.Foo'

class Foo(dbus.service.object):
    # …

    @dbus.service.method(interface=dbus.PROPERTIES_IFACE,
                         in_signature='ss', out_signature='v')
    def Get(self, interface_name, property_name):
        return self.GetAll(interface_name)[property_name]

    @dbus.service.method(interface=dbus.PROPERTIES_IFACE,
                         in_signature='s', out_signature='a{sv}')
    def GetAll(self, interface_name):
        if interface_name == MY_INTERFACE:
            return { 'Blah': self.blah,
                     # …
                   }
        else:
            raise dbus.exceptions.DBusException(
                'com.example.UnknownInterface',
                'The Foo object does not implement the %s interface'
                    % interface_name)

    @dbus.service.method(interface=dbus.PROPERTIES_IFACE,
                         in_signature='ssv'):
    def Set(self, interface_name, property_name, new_value):
        # validate the property name and value, update internal state…
        self.PropertiesChanged(interface_name,
            { property_name: new_value }, [])

    @dbus.service.signal(interface=dbus.PROPERTIES_IFACE,
                         signature='sa{sv}as')
    def PropertiesChanged(self, interface_name, changed_properties,
                          invalidated_properties):
        pass*/
