import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { BRAND } from "@/components/rental-ui";
import { ScreenContainer } from "@/components/screen-container";

export default function ProfileScreen() {
  return (
    <ScreenContainer className="p-4" containerClassName="bg-background">
      <Text style={styles.eyebrow}>DHULE DRIVE</Text><Text style={styles.title}>Help & account</Text>
      <View style={styles.infoCard}><View style={styles.infoIcon}><MaterialIcons name="support-agent" color={BRAND.teal} size={26} /></View><View style={styles.infoText}><Text style={styles.cardTitle}>Need help with a rental?</Text><Text style={styles.cardDetail}>Quote your booking reference when you call or message the rental team.</Text></View></View>
      <View style={styles.tip}><MaterialIcons name="info-outline" color="#92400E" size={19} /><Text style={styles.tipText}>Your booking requests are stored on this device. Save your request reference if you change phones.</Text></View>
      {Platform.OS === "web" ? <TouchableOpacity onPress={() => router.push("/admin" as never)} style={styles.ownerButton}><View style={styles.ownerIcon}><MaterialIcons name="dashboard" color={BRAND.saffron} size={22} /></View><View style={{ flex: 1 }}><Text style={styles.ownerTitle}>Owner console</Text><Text style={styles.ownerDetail}>Manage the fleet and booking requests.</Text></View><MaterialIcons name="chevron-right" color={BRAND.muted} size={22} /></TouchableOpacity> : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  eyebrow: { color: BRAND.teal, fontSize: 11, fontWeight: "900", letterSpacing: 1, marginTop: 8 }, title: { color: BRAND.navy, fontWeight: "900", fontSize: 28, letterSpacing: -0.7, marginTop: 5 },
  infoCard: { backgroundColor: BRAND.white, borderWidth: 1, borderColor: BRAND.border, padding: 16, borderRadius: 18, marginTop: 24, flexDirection: "row", gap: 13 }, infoIcon: { backgroundColor: "#CCFBF1", height: 48, width: 48, borderRadius: 14, alignItems: "center", justifyContent: "center" }, infoText: { flex: 1 }, cardTitle: { color: BRAND.slate, fontWeight: "900", fontSize: 15 }, cardDetail: { color: BRAND.muted, fontSize: 12, lineHeight: 18, marginTop: 4 },
  tip: { backgroundColor: "#FFFBEB", borderRadius: 14, padding: 14, flexDirection: "row", gap: 9, marginTop: 14 }, tipText: { color: "#92400E", fontSize: 12, lineHeight: 18, flex: 1 }, ownerButton: { flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: BRAND.border, backgroundColor: BRAND.white, padding: 15, borderRadius: 17, marginTop: 26 }, ownerIcon: { height: 44, width: 44, borderRadius: 13, backgroundColor: BRAND.navy, alignItems: "center", justifyContent: "center" }, ownerTitle: { color: BRAND.navy, fontWeight: "900", fontSize: 15 }, ownerDetail: { color: BRAND.muted, fontSize: 12, marginTop: 3 },
});
