import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useLiveMeetStore} from '../../service/meetStore';
import LinearGradient from 'react-native-linear-gradient';
import {footerStyles} from '../../styles/footerStyles';
import {
  Hand,
  Mic,
  MicOff,
  MoreVertical,
  PhoneOff,
  Video,
  VideoOff,
} from 'lucide-react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {goBack} from '../../utils/NavigationUtils';

const MeetFooter = ({toggleMic, toggleVideo}) => {
  const {micOn, videoOn} = useLiveMeetStore();

  const getIconStyle = isActive => ({
    backgroundColor: isActive ? 'rgba(255,255,255, 0.1)' : '#FFFFFF',
    borderRadius: 50,
    padding: 12,
  });

  const getIconColor = isActive => (isActive ? '#fff' : '#000000');

  return (
    <LinearGradient
      colors={['#000', 'rgba(0,0,0,0.7)', 'transparent'].reverse()}
      style={footerStyles.footerContainer}>
      <View style={footerStyles.iconContainer}>
        <TouchableOpacity
          style={footerStyles.callEndButton}
          onPress={() => goBack()}>
          <PhoneOff size={RFValue(14)} color={'#fff'} />
        </TouchableOpacity>

        <TouchableOpacity
          style={getIconStyle(videoOn)}
          onPress={() => toggleVideo()}>
          {videoOn ? (
            <Video size={RFValue(14)} color={getIconColor(videoOn)} />
          ) : (
            <VideoOff size={RFValue(14)} color={getIconColor(videoOn)} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={getIconStyle(micOn)}
          onPress={() => toggleMic()}>
          {micOn ? (
            <Mic size={RFValue(14)} color={getIconColor(micOn)} />
          ) : (
            <MicOff size={RFValue(14)} color={getIconColor(micOn)} />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={footerStyles.iconButton}>
          <Hand size={RFValue(14)} color={'#fff'} />
        </TouchableOpacity>

        <TouchableOpacity style={footerStyles.iconButton}>
          <MoreVertical size={RFValue(14)} color={'#fff'} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default MeetFooter;

const styles = StyleSheet.create({});
