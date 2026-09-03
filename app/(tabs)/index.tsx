import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { BRAND, EmptyState, SectionHeading, VehicleCard } from "@/components/rental-ui";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";

const today = new Date().toISOString().slice(0, 10);
const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);

export default function ExploreScreen() {
  const [pickupDate, setPickupDate] = useState(today);
  const [returnDate, setReturnDate] = useState(tomorrow);
  const [category, setCategory] = useState("All");
  const { data: vehicles = [], isLoading, error, refetch } = trpc.catalog.list.useQuery();

  const categories = useMemo(() => ["All", ...Array.from(new Set(vehicles.map((vehicle) => vehicle.category)))], [vehicles]);
  const filteredVehicles = useMemo(() => vehicles.filter((vehicle) => vehicle.availability === "available" && (category === "All" || vehicle.category === category)), [category, vehicles]);

  const openVehicle = (id: number) => {
    router.push({ pathname: "/vehicle/[id]", params: { id: String(id), pickupDate, returnDate } } as never);
  };

  return (
    <ScreenContainer containerClassName="bg-background" className="flex-1">
      <FlatList
        data={filteredVehicles}
        keyExtractor={(vehicle) => String(vehicle.id)}
        renderItem={({ item }) => <VehicleCard vehicle={item} onPress={() => openVehicle(item.id)} />}
        refreshing={isLoading}
        onRefresh={refetch}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.hero}>
              <View style={styles.heroTopRow}>
                <View>
                  <Text style={styles.eyebrow}>CAR RENTAL · DHULE</Text>
                  <Text style={styles.heroTitle}>Drive your plan{`\n`}your way.</Text>
                </View>
                <View style={styles.heroIcon}><MaterialIcons name="directions-car-filled" color={BRAND.saffron} size={29} /></View>
              </View>
              <Text style={styles.heroCopy}>Reliable cars for city errands, family travel, and memorable outstation days.</Text>
            </View>

            <View style={styles.searchCard}>
              <View style={styles.searchTitleRow}>
                <MaterialIcons name="location-on" color={BRAND.teal} size={20} />
                <Text style={styles.searchTitle}>Pickup in Dhule</Text>
              </View>
              <View style={styles.dateRow}>
                <View style={styles.dateField}>
                  <Text style={styles.inputLabel}>PICKUP DATE</Text>
                  <TextInput value={pickupDate} onChangeText={setPickupDate} placeholder="YYYY-MM-DD" placeholderTextColor="#94A3B8" autoCapitalize="none" style={styles.dateInput} />
                </View>
                <View style={styles.dateDivider}><MaterialIcons name="arrow-forward" size={18} color={BRAND.muted} /></View>
                <View style={styles.dateField}>
                  <Text style={styles.inputLabel}>RETURN DATE</Text>
                  <TextInput value={returnDate} onChangeText={setReturnDate} placeholder="YYYY-MM-DD" placeholderTextColor="#94A3B8" autoCapitalize="none" style={styles.dateInput} />
                </View>
              </View>
            </View>

            <SectionHeading title="Available cars" />
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={categories}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.categoryRow}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setCategory(item)} style={[styles.categoryChip, category === item && styles.categoryChipActive]}>
                  <Text style={[styles.categoryLabel, category === item && styles.categoryLabelActive]}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </>
        }
        ListEmptyComponent={
          isLoading ? <ActivityIndicator color={BRAND.teal} style={{ marginTop: 36 }} /> : <EmptyState icon="directions-car" title="No cars match this filter" detail={error ? "We could not load the fleet. Pull down to try again." : "Try another category or check back soon."} />
        }
        ListFooterComponent={<Text style={styles.footerNote}>Daily rates shown are estimates. Your final booking is confirmed by the Dhule Drive team.</Text>}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: { padding: 16, paddingBottom: 40, backgroundColor: BRAND.mist },
  hero: { backgroundColor: BRAND.navy, padding: 20, paddingTop: 22, borderRadius: 22, overflow: "hidden" },
  heroTopRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  eyebrow: { color: "#FDE68A", fontSize: 11, fontWeight: "900", letterSpacing: 1.1 },
  heroTitle: { color: BRAND.white, fontWeight: "900", fontSize: 29, lineHeight: 34, letterSpacing: -0.9, marginTop: 9 },
  heroCopy: { color: "#D9E2EC", lineHeight: 20, fontSize: 13, marginTop: 12, maxWidth: 300 },
  heroIcon: { height: 55, width: 55, borderRadius: 18, backgroundColor: "#243B53", alignItems: "center", justifyContent: "center" },
  searchCard: { backgroundColor: BRAND.white, borderRadius: 18, padding: 15, borderWidth: 1, borderColor: BRAND.border, marginTop: -2, marginHorizontal: 10, shadowColor: "#102A43", shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  searchTitleRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  searchTitle: { color: BRAND.slate, fontSize: 14, fontWeight: "800" },
  dateRow: { flexDirection: "row", alignItems: "center", marginTop: 13 },
  dateField: { flex: 1 },
  inputLabel: { color: BRAND.muted, fontSize: 9, letterSpacing: 0.7, fontWeight: "900" },
  dateInput: { paddingVertical: 5, color: BRAND.navy, fontWeight: "800", fontSize: 14, borderBottomWidth: 1, borderBottomColor: BRAND.border, marginTop: 4 },
  dateDivider: { paddingHorizontal: 10, paddingTop: 15 },
  categoryRow: { gap: 8, paddingBottom: 16 },
  categoryChip: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: BRAND.white, borderWidth: 1, borderColor: BRAND.border, borderRadius: 999 },
  categoryChipActive: { backgroundColor: BRAND.teal, borderColor: BRAND.teal },
  categoryLabel: { color: BRAND.muted, fontSize: 13, fontWeight: "800" },
  categoryLabelActive: { color: BRAND.white },
  footerNote: { color: BRAND.muted, textAlign: "center", fontSize: 12, lineHeight: 18, paddingHorizontal: 22, paddingTop: 10 },
});
