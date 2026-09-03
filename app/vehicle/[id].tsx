import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { BRAND, Spec, StatusPill } from "@/components/rental-ui";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { formatRupees } from "@/shared/rental-utils";

export default function VehicleDetailScreen() {
  const params = useLocalSearchParams<{ id: string; pickupDate?: string; returnDate?: string }>();
  const vehicleId = Number(params.id);
  const { data: vehicle, isLoading } = trpc.catalog.byId.useQuery({ id: vehicleId }, { enabled: Number.isFinite(vehicleId) });

  if (isLoading) return <ScreenContainer className="items-center justify-center"><ActivityIndicator color={BRAND.teal} /></ScreenContainer>;
  if (!vehicle) return <ScreenContainer className="items-center justify-center p-6"><Text style={styles.errorText}>This car is no longer available.</Text><TouchableOpacity onPress={() => router.back()} style={styles.backButton}><Text style={styles.backLabel}>Go back</Text></TouchableOpacity></ScreenContainer>;

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-background">
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: vehicle.imageUrl }} style={styles.image} contentFit="cover" transition={180} />
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}><MaterialIcons name="arrow-back" color={BRAND.navy} size={22} /></TouchableOpacity>
          <View style={styles.statusWrap}><StatusPill status={vehicle.availability} /></View>
        </View>
        <View style={styles.detailCard}>
          <Text style={styles.category}>{vehicle.category}</Text>
          <Text style={styles.title}>{vehicle.brand} {vehicle.name}</Text>
          <Text style={styles.description}>{vehicle.description}</Text>
          <View style={styles.specGrid}>
            <Spec icon="event-seat" label={`${vehicle.seats} seats`} />
            <Spec icon="settings" label={vehicle.transmission} />
            <Spec icon="local-gas-station" label={vehicle.fuel} />
            <Spec icon="verified" label="Sanitised" />
          </View>
          <View style={styles.included}>
            <Text style={styles.includedTitle}>Included with your rental</Text>
            <Text style={styles.includedCopy}>Basic insurance support, roadside assistance coordination, and a clean, ready-to-go vehicle.</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <View><Text style={styles.price}>{formatRupees(vehicle.dailyRate)}<Text style={styles.priceUnit}> / day</Text></Text><Text style={styles.priceNote}>Excludes fuel and extra km charges</Text></View>
        <TouchableOpacity disabled={vehicle.availability !== "available"} onPress={() => router.push({ pathname: "/booking/[id]", params: { id: String(vehicle.id), pickupDate: params.pickupDate ?? "", returnDate: params.returnDate ?? "" } } as never)} style={[styles.primaryButton, vehicle.availability !== "available" && styles.disabledButton]}><Text style={styles.primaryLabel}>{vehicle.availability === "available" ? "Request booking" : "Unavailable"}</Text></TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 112, backgroundColor: BRAND.mist },
  imageWrap: { height: 290, backgroundColor: "#E2E8F0" },
  image: { width: "100%", height: "100%" },
  iconButton: { position: "absolute", top: 16, left: 16, width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFFE8" },
  statusWrap: { position: "absolute", right: 16, bottom: 16 },
  detailCard: { marginTop: -18, backgroundColor: BRAND.white, borderRadius: 22, padding: 20, minHeight: 350 },
  category: { color: BRAND.teal, fontWeight: "900", fontSize: 11, letterSpacing: 1.1, textTransform: "uppercase" },
  title: { color: BRAND.navy, fontSize: 27, fontWeight: "900", letterSpacing: -0.6, marginTop: 6 },
  description: { color: BRAND.muted, fontSize: 14, lineHeight: 21, marginTop: 10 },
  specGrid: { flexDirection: "row", flexWrap: "wrap", gap: 14, paddingVertical: 20, borderBottomColor: BRAND.border, borderBottomWidth: 1 },
  included: { backgroundColor: "#FFFBEB", borderRadius: 14, padding: 14, marginTop: 18 },
  includedTitle: { color: "#92400E", fontWeight: "900", fontSize: 13 },
  includedCopy: { color: "#92400E", fontSize: 12, lineHeight: 18, marginTop: 4 },
  bottomBar: { position: "absolute", left: 0, right: 0, bottom: 0, padding: 14, paddingHorizontal: 18, backgroundColor: BRAND.white, borderTopWidth: 1, borderTopColor: BRAND.border, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  price: { color: BRAND.navy, fontSize: 18, fontWeight: "900" },
  priceUnit: { color: BRAND.muted, fontSize: 12, fontWeight: "600" },
  priceNote: { color: BRAND.muted, fontSize: 10, marginTop: 2 },
  primaryButton: { backgroundColor: BRAND.saffron, paddingHorizontal: 18, paddingVertical: 14, borderRadius: 12 },
  disabledButton: { backgroundColor: "#CBD5E1" },
  primaryLabel: { color: BRAND.navy, fontWeight: "900", fontSize: 13 },
  errorText: { color: BRAND.navy, fontWeight: "800", fontSize: 17 },
  backButton: { marginTop: 16, backgroundColor: BRAND.teal, borderRadius: 12, paddingHorizontal: 18, paddingVertical: 11 },
  backLabel: { color: BRAND.white, fontWeight: "800" },
});
