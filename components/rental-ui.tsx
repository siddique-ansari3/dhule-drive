import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { formatRupees } from "@/shared/rental-utils";
import type { VehicleCardData } from "@/shared/rental";

export const BRAND = {
  navy: "#102A43",
  saffron: "#F59E0B",
  teal: "#0F766E",
  mist: "#F7F9FC",
  slate: "#1F2937",
  muted: "#64748B",
  border: "#DCE3EC",
  white: "#FFFFFF",
  red: "#C2410C",
} as const;

export function SectionHeading({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <TouchableOpacity onPress={onAction} style={styles.textAction} activeOpacity={0.72}>
          <Text style={styles.textActionLabel}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tone = status === "confirmed" || status === "available" ? BRAND.teal : status === "declined" || status === "unavailable" ? BRAND.red : status === "completed" ? BRAND.navy : BRAND.saffron;
  const label = status.replace(/_/g, " ");
  return (
    <View style={[styles.pill, { backgroundColor: `${tone}18` }]}>
      <View style={[styles.pillDot, { backgroundColor: tone }]} />
      <Text style={[styles.pillLabel, { color: tone }]}>{label}</Text>
    </View>
  );
}

export function VehicleCard({ vehicle, onPress, compact = false }: { vehicle: VehicleCardData; onPress: () => void; compact?: boolean }) {
  return (
    <TouchableOpacity activeOpacity={0.82} onPress={onPress} style={[styles.vehicleCard, compact && styles.vehicleCardCompact]}>
      <Image source={{ uri: vehicle.imageUrl }} style={[styles.vehicleImage, compact && styles.vehicleImageCompact]} contentFit="cover" transition={180} />
      <View style={styles.vehicleBody}>
        <View style={styles.vehicleTopRow}>
          <View style={styles.vehicleTitleWrap}>
            <Text numberOfLines={1} style={styles.vehicleName}>{vehicle.brand} {vehicle.name}</Text>
            <Text style={styles.vehicleCategory}>{vehicle.category}</Text>
          </View>
          <StatusPill status={vehicle.availability} />
        </View>
        <View style={styles.specRow}>
          <Spec icon="event-seat" label={`${vehicle.seats} seats`} />
          <Spec icon="settings" label={vehicle.transmission} />
          <Spec icon="local-gas-station" label={vehicle.fuel} />
        </View>
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.rate}>{formatRupees(vehicle.dailyRate)}<Text style={styles.rateUnit}> / day</Text></Text>
          </View>
          <MaterialIcons name="arrow-forward" size={20} color={BRAND.navy} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function Spec({ icon, label }: { icon: keyof typeof MaterialIcons.glyphMap; label: string }) {
  return (
    <View style={styles.spec}>
      <MaterialIcons name={icon} size={15} color={BRAND.muted} />
      <Text style={styles.specLabel}>{label}</Text>
    </View>
  );
}

export function EmptyState({ icon, title, detail, action }: { icon: keyof typeof MaterialIcons.glyphMap; title: string; detail: string; action?: ReactNode }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}><MaterialIcons name={icon} size={28} color={BRAND.teal} /></View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDetail}>{detail}</Text>
      {action}
    </View>
  );
}

export const styles = StyleSheet.create({
  pressed: { opacity: 0.72 },
  sectionHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 24, marginBottom: 12 },
  sectionTitle: { color: BRAND.navy, fontSize: 20, fontWeight: "800", letterSpacing: -0.25 },
  textAction: { paddingHorizontal: 2, paddingVertical: 8 },
  textActionLabel: { color: BRAND.teal, fontWeight: "800", fontSize: 14 },
  pill: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 999 },
  pillDot: { width: 6, height: 6, borderRadius: 3 },
  pillLabel: { textTransform: "capitalize", fontSize: 11, fontWeight: "800" },
  vehicleCard: { backgroundColor: BRAND.white, borderRadius: 18, overflow: "hidden", borderWidth: 1, borderColor: BRAND.border, marginBottom: 14 },
  vehicleCardCompact: { flexDirection: "row", minHeight: 150 },
  vehicleImage: { width: "100%", height: 158, backgroundColor: "#E5E7EB" },
  vehicleImageCompact: { width: 126, height: "100%" },
  vehicleBody: { padding: 14, flex: 1, justifyContent: "space-between" },
  vehicleTopRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 8 },
  vehicleTitleWrap: { flex: 1 },
  vehicleName: { color: BRAND.slate, fontSize: 16, fontWeight: "800", lineHeight: 21 },
  vehicleCategory: { color: BRAND.muted, fontSize: 12, marginTop: 3 },
  specRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 13 },
  spec: { flexDirection: "row", alignItems: "center", gap: 4 },
  specLabel: { color: BRAND.muted, fontSize: 11, textTransform: "capitalize" },
  cardFooter: { borderTopWidth: 1, borderTopColor: "#EEF2F6", marginTop: 14, paddingTop: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rate: { color: BRAND.navy, fontSize: 16, fontWeight: "900" },
  rateUnit: { color: BRAND.muted, fontSize: 12, fontWeight: "600" },
  emptyState: { borderWidth: 1, borderColor: BRAND.border, backgroundColor: BRAND.white, borderRadius: 18, alignItems: "center", padding: 28, gap: 8 },
  emptyIcon: { width: 56, height: 56, alignItems: "center", justifyContent: "center", backgroundColor: "#CCFBF1", borderRadius: 28, marginBottom: 2 },
  emptyTitle: { color: BRAND.navy, fontWeight: "800", fontSize: 17 },
  emptyDetail: { color: BRAND.muted, textAlign: "center", fontSize: 13, lineHeight: 20, maxWidth: 290 },
});
