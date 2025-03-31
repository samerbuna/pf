import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Platform } from 'react-native';
import { StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';

type Props = Omit<React.ComponentProps<typeof Link>, 'href'> & {
  href: `https://${string}`;
};

export function ExternalLink(props: Props) {
  return (
    <Link
      target="_blank"
      {...props}
      href={props.href as any}
      onPress={(e) => {
        if (Platform.OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          e.preventDefault();
          // Open the link in an in-app browser.
          WebBrowser.openBrowserAsync(props.href);
        }
      }}
    >
      <ThemedText style={styles.text}>{props.children}</ThemedText>
    </Link>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#2e78b7',
  },
});
