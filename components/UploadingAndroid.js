import { Text, StyleSheet, View, TouchableOpacity, Platform } from "react-native";
import ProgressBar from "./ProgressBar";
import { Video } from "expo-av";

export function UploadingAndroid({ video, progress }) {
  // The component has the same logic. However, the blur effect works differently on Android.
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
        style={{
          width: "80%",
        }}
      >
        <View
          style={{
            alignItems: "center",
            paddingVertical: 10,
            rowGap: 12,
            borderRadius: 14,
            backgroundColor: "#FFFFFF",
          }}
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
    </View>
  );
}