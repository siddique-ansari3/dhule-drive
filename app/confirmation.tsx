import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { BRAND } from "@/components/rental-ui";
import { ScreenContainer } from "@/components/screen-container";
import { formatRupees } from "@/shared/rental-utils";

export default function ConfirmationScreen() {
  const params = useLocalSearchParams<{ reference: string; vehicleName: string; total: string; pickupDate: string; returnDate: string }>();
  return (
    <ScreenContainer className="items-center justify-center p-6" containerClassName="bg-background">
      <View style={styles.icon}><MaterialIcons name="check" size={45} color={BRAND.white} /></View>
      <Text style={styles.title}>Request sent</Text>
      <Text style={styles.detail}>Thanks for choosing Dhule Drive. We will verify the vehicle and contact you to confirm your rental.</Text>
      <View style={styles.summary}><Text style={styles.ref}>REFERENCE · {params.reference}</Text><Text style={styles.car}>{params.vehicleName}</Text><Text style={styles.dates}>{params.pickupDate} to {params.returnDate}</Text><View style={styles.line} /><Text style={styles.estimate}>Estimated total</Text><Text style={styles.total}>{formatRupees(Number(params.total || 0))}</Text></View>
      <TouchableOpacity onPress={() => router.replace("/(tabs)/bookings" as never)} style={styles.primary}><Text style={styles.primaryText}>View my requests</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace("/(tabs)" as never)} style={styles.secondary}><Text style={styles.secondaryText}>Browse more cars</Text></TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  icon: { backgroundColor: BRAND.teal, width: 82, height: 82, borderRadius: 41, alignItems: "center", justifyContent: "center", marginBottom: 19 },
  title: { color: BRAND.navy, fontSize: 29, fontWeight: "900", letterSpacing: -0.7 }, detail: { color: BRAND.muted, fontSize: 14, lineHeight: 21, textAlign: "center", marginTop: 9, maxWidth: 325 },
  summary: { width: "100%", borderRadius: 18, padding: 18, backgroundColor: BRAND.white, borderWidth: 1, borderColor: BRAND.border, marginTop: 26 }, ref: { color: BRAND.teal, fontSize: 10, fontWeight: "900", letterSpacing: 0.7 }, car: { color: BRAND.slate, fontSize: 18, fontWeight: "900", marginTop: 7 }, dates: { color: BRAND.muted, fontSize: 13, marginTop: 4 }, line: { height: 1, backgroundColor: BRAND.border, marginVertical: 15 }, estimate: { color: BRAND.muted, fontSize: 12 }, total: { color: BRAND.navy, fontSize: 23, fontWeight: "900", marginTop: 2 },
  primary: { backgroundColor: BRAND.saffron, borderRadius: 13, paddingVertical: 15, alignItems: "center", width: "100%", marginTop: 24 }, primaryText: { color: BRAND.navy, fontWeight: "900", fontSize: 15 }, secondary: { padding: 16 }, secondaryText: { color: BRAND.teal, fontWeight: "900", fontSize: 14 },
});
