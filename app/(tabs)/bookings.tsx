import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { BRAND, EmptyState, StatusPill } from "@/components/rental-ui";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { formatRupees } from "@/shared/rental-utils";

const REQUEST_REFS_KEY = "dhule-drive.booking-references";

export default function MyRequestsScreen() {
  const [references, setReferences] = useState<string[]>([]);
  const loadReferences = useCallback(async () => setReferences(JSON.parse((await AsyncStorage.getItem(REQUEST_REFS_KEY)) ?? "[]")), []);
  useEffect(() => { loadReferences(); }, [loadReferences]);
  const { data: bookings = [], isLoading, refetch } = trpc.booking.byReferences.useQuery({ references }, { enabled: references.length > 0 });

  return (
    <ScreenContainer className="flex-1" containerClassName="bg-background">
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.reference}
        contentContainerStyle={styles.content}
        refreshing={isLoading}
        onRefresh={async () => { await loadReferences(); await refetch(); }}
        ListHeaderComponent={<View style={styles.header}><Text style={styles.eyebrow}>YOUR TRIPS</Text><Text style={styles.title}>Booking requests</Text><Text style={styles.subtitle}>Your requests are saved on this device. Pull down to see the latest status.</Text></View>}
        renderItem={({ item }) => <View style={styles.card}><View style={styles.cardTop}><View><Text style={styles.ref}>{item.reference}</Text><Text style={styles.car}>{item.vehicleBrand} {item.vehicleName}</Text></View><StatusPill status={item.status} /></View><View style={styles.meta}><MaterialIcons name="date-range" size={16} color={BRAND.muted} /><Text style={styles.metaText}>{item.pickupDate} → {item.returnDate}</Text></View><View style={styles.meta}><MaterialIcons name="location-on" size={16} color={BRAND.muted} /><Text numberOfLines={1} style={styles.metaText}>{item.pickupLocation}</Text></View><View style={styles.cardBottom}><Text style={styles.estimate}>Estimated total</Text><Text style={styles.amount}>{formatRupees(item.quotedTotal)}</Text></View></View>}
        ListEmptyComponent={isLoading && references.length ? <ActivityIndicator color={BRAND.teal} style={{ marginTop: 35 }} /> : <EmptyState icon="event-note" title="No booking requests yet" detail="Choose a car on the Explore tab and submit a rental request. It will appear here on this device." />}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 38, backgroundColor: BRAND.mist, flexGrow: 1 }, header: { paddingTop: 8, paddingBottom: 18 }, eyebrow: { color: BRAND.teal, fontSize: 11, fontWeight: "900", letterSpacing: 1 }, title: { color: BRAND.navy, fontSize: 27, fontWeight: "900", letterSpacing: -0.7, marginTop: 5 }, subtitle: { color: BRAND.muted, fontSize: 13, lineHeight: 19, marginTop: 7, maxWidth: 330 },
  card: { backgroundColor: BRAND.white, borderWidth: 1, borderColor: BRAND.border, borderRadius: 17, padding: 15, marginBottom: 12 }, cardTop: { flexDirection: "row", justifyContent: "space-between", gap: 8 }, ref: { color: BRAND.teal, fontSize: 10, letterSpacing: 0.7, fontWeight: "900" }, car: { color: BRAND.slate, fontSize: 16, fontWeight: "900", marginTop: 5 }, meta: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12 }, metaText: { color: BRAND.muted, fontSize: 12, flex: 1 }, cardBottom: { borderTopWidth: 1, borderTopColor: "#EEF2F6", marginTop: 14, paddingTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, estimate: { color: BRAND.muted, fontSize: 12 }, amount: { color: BRAND.navy, fontWeight: "900", fontSize: 16 },
});
