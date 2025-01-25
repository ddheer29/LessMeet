import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {joinStyles} from '../styles/joinStyles';
import {ChevronLeft, EllipsisVerticalIcon, Video} from 'lucide-react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Colors} from '../utils/Constants';
import {goBack, navigate} from '../utils/NavigationUtils';
import {LinearGradient} from 'react-native-linear-gradient';
import {useWS} from '../service/api/WSProvider';
import {useLiveMeetStore} from '../service/meetStore';
import {useUserStore} from '../service/userStore';
import {checkSession, createSession} from '../service/api/session';
import {removeHyphens} from '../utils/Helpers';

const JoinMeetScreen = () => {
  const [code, setCode] = useState('');
  const {emit} = useWS();
  const {addSessionId, removeSessionId} = useLiveMeetStore();
  const {user, addSession, removeSession} = useUserStore();
  const createNewMeet = async () => {
    const sessionId = await createSession();
    if (sessionId) {
      addSession(sessionId);
      addSessionId(sessionId);
      emit('prepare-sessioin', {
        userId: user?.id,
        sessionId,
      });
      navigate('PrepareMeetScreen');
    }
  };
  const joinViaSessionId = async () => {
    const sessionId = await checkSession();
    if (sessionId) {
      emit('prepare-sessioin', {
        userId: user?.id,
        sessionId: removeHyphens(code),
      });
      addSession(code);
      addSessionId(code);
      navigate('PrepareMeetScreen');
    } else {
      removeSession(sessionId);
      removeSessionId(sessionId);
      setCode('');
      Alert.alert('There is no meeting found');
    }
  };

  return (
    <View style={joinStyles.container}>
      <SafeAreaView />
      <View style={joinStyles.headerContainer}>
        <ChevronLeft size={RFValue(20)} color={Colors.text} onPress={goBack} />
        <Text style={joinStyles.headerText}>Join Meet</Text>
        <EllipsisVerticalIcon size={18} color={Colors.text} />
      </View>
      <LinearGradient
        colors={['#007AFF', '#A6C8FF']}
        style={joinStyles.gradientButton}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <TouchableOpacity style={joinStyles.button} onPress={createNewMeet}>
          <Video size={RFValue(22)} color={'#fff'} />
          <Text style={joinStyles.buttonText}>Create New Meet</Text>
        </TouchableOpacity>
      </LinearGradient>

      <Text style={joinStyles.orText}>OR</Text>
      <View style={joinStyles.inputContainer}>
        <Text style={joinStyles.labelText}>
          Enter the code provided by the meeting organiser
        </Text>
        <TextInput
          style={joinStyles.inputBox}
          value={code}
          onChangeText={setCode}
          returnKeyLabel="Join"
          returnKeyType="join"
          onSubmitEditing={() => joinViaSessionId(code)}
          placeholder="Example: abc-mnop-xyz"
          placeholderTextColor={'#888'}
        />
        <Text style={joinStyles.noteText}>
          This meeting is secured with the Cloud encryption but not with the
          end-to-end encryption{' '}
          <Text style={joinStyles.linkText}>Learn more</Text>
        </Text>
      </View>
    </View>
  );
};

export default JoinMeetScreen;

const styles = StyleSheet.create({});
