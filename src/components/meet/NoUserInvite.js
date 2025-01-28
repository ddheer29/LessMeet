import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {useLiveMeetStore} from '../../service/meetStore';
import {inviteStyles} from '../../styles/inviteStyles';
import {addHyphens} from '../../utils/Helpers';
import {Clipboard, Share} from 'lucide-react-native';

const NoUserInvite = () => {
  const {sessionId} = useLiveMeetStore();

  return (
    <View style={inviteStyles.container}>
      <Text style={inviteStyles.headerText}>You'r the only one here</Text>
      <Text style={inviteStyles.subText}>
        Share this meeting link with others that you want in this meeting
      </Text>
      <View style={inviteStyles.linkContainer}>
        <Text style={inviteStyles.linkText}>
          meet.google.com/{addHyphens(sessionId)}
        </Text>
        <TouchableOpacity>
          <Clipboard size={20} color={'#fff'} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={inviteStyles.shareButton}>
        <Share size={20} color={'#000'} />
        <Text style={inviteStyles.shareText}>Share invite</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoUserInvite;

const styles = StyleSheet.create({});
