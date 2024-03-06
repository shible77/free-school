import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import ProgressBar from "./ProgressBar";
import { Video } from "expo-av";

export function Uploading({ video, progress }) {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
        },
      ]}
    >
      <View
        blurType="ultraThinMaterialDark"
        style={StyleSheet.absoluteFill}
      ></View>
      <View
        style={{
          width: "70%",
          alignItems: "center",
          paddingVertical: 16,
          rowGap: 12,
          borderRadius: 14,
        }}
        blurType="light"
      >
        {video && (
          <Video
            source={{
              uri: video,
            }}
            videoStyle={{}}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="contain"
            // shouldPlay
            // isLooping
            style={{ width: 200, height: 200 }}
          // useNativeControls
          />
        )}
        <Text style={{ fontSize: 12 }}>Uploading...</Text>
        <ProgressBar progress={progress} />
        <View
          style={{
            height: 1,
            borderWidth: StyleSheet.hairlineWidth,
            width: "100%",
            borderColor: "#00000020",
          }}
        />
        <TouchableOpacity>
          <Text style={{ fontWeight: "500", color: "#3478F6", fontSize: 17 }}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}