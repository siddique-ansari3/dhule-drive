import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import { type ReactNode, useMemo, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native";

import { BRAND } from "@/components/rental-ui";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { calculateRentalDays, formatRupees } from "@/shared/rental-utils";

const REQUEST_REFS_KEY = "dhule-drive.booking-references";

export default function BookingScreen() {
  const params = useLocalSearchParams<{ id: string; pickupDate?: string; returnDate?: string }>();
  const vehicleId = Number(params.id);
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupDate, setPickupDate] = useState(params.pickupDate || today);
  const [returnDate, setReturnDate] = useState(params.returnDate || tomorrow);
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnTime, setReturnTime] = useState("10:00");
  const [pickupLocation, setPickupLocation] = useState("Dhule city");
  const [withDriver, setWithDriver] = useState(false);
  const [notes, setNotes] = useState("");
  const { data: vehicle, isLoading } = trpc.catalog.byId.useQuery({ id: vehicleId }, { enabled: Number.isFinite(vehicleId) });
  const bookingMutation = trpc.booking.create.useMutation();
  const days = useMemo(() => calculateRentalDays(pickupDate, returnDate), [pickupDate, returnDate]);
  const estimatedTotal = vehicle && days ? days * vehicle.dailyRate : 0;

  const submit = async () => {
    if (!vehicle || !days) {
      Alert.alert("Check your rental dates", "Please enter a valid pickup and return date.");
      return;
    }
    try {
      const result = await bookingMutation.mutateAsync({ vehicleId, customerName: name, phone, pickupDate, returnDate, pickupTime, returnTime, pickupLocation, tripType: withDriver ? "with_driver" : "self_drive", notes: notes || undefined });
      const existingRefs = JSON.parse((await AsyncStorage.getItem(REQUEST_REFS_KEY)) ?? "[]") as string[];
      await AsyncStorage.setItem(REQUEST_REFS_KEY, JSON.stringify([result.reference, ...existingRefs.filter((reference) => reference !== result.reference)].slice(0, 30)));
      router.replace({ pathname: "/confirmation", params: { reference: result.reference, vehicleName: result.vehicleName, total: String(result.quotedTotal), pickupDate, returnDate } } as never);
    } catch (error) {
      Alert.alert("We could not submit your request", error instanceof Error ? error.message : "Please check your details and try again.");
    }
  };

  if (isLoading) return <ScreenContainer className="items-center justify-center"><ActivityIndicator color={BRAND.teal} /></ScreenContainer>;
  if (!vehicle) return <ScreenContainer className="items-center justify-center p-6"><Text style={styles.problem}>This vehicle is not available to book.</Text></ScreenContainer>;

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-background">
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.headerRow}><TouchableOpacity onPress={() => router.back()} style={styles.back}><MaterialIcons name="arrow-back" size={22} color={BRAND.navy} /></TouchableOpacity><View><Text style={styles.headerTitle}>Request booking</Text><Text style={styles.headerSub}>{vehicle.brand} {vehicle.name}</Text></View></View>
        <View style={styles.quoteCard}><View><Text style={styles.quoteLabel}>ESTIMATED RENTAL</Text><Text style={styles.quotePrice}>{formatRupees(estimatedTotal)}</Text><Text style={styles.quoteNote}>{days ? `${days} rental day${days === 1 ? "" : "s"} × ${formatRupees(vehicle.dailyRate)}` : "Enter valid dates to see your estimate"}</Text></View><MaterialIcons name="receipt-long" size={28} color={BRAND.saffron} /></View>

        <FormSection title="Your details">
          <Field label="FULL NAME" value={name} onChangeText={setName} placeholder="Enter your name" />
          <Field label="MOBILE NUMBER" value={phone} onChangeText={setPhone} placeholder="e.g. 98765 43210" keyboardType="phone-pad" />
        </FormSection>
        <FormSection title="Rental schedule">
          <View style={styles.twoCol}><View style={styles.col}><Field label="PICKUP DATE" value={pickupDate} onChangeText={setPickupDate} placeholder="YYYY-MM-DD" /></View><View style={styles.col}><Field label="RETURN DATE" value={returnDate} onChangeText={setReturnDate} placeholder="YYYY-MM-DD" /></View></View>
          <View style={styles.twoCol}><View style={styles.col}><Field label="PICKUP TIME" value={pickupTime} onChangeText={setPickupTime} placeholder="10:00" /></View><View style={styles.col}><Field label="RETURN TIME" value={returnTime} onChangeText={setReturnTime} placeholder="10:00" /></View></View>
          <Field label="PICKUP ADDRESS" value={pickupLocation} onChangeText={setPickupLocation} placeholder="Area, landmark, or hotel in Dhule" />
        </FormSection>
        <FormSection title="Trip preference">
          <View style={styles.driverOption}><View style={styles.driverCopy}><Text style={styles.driverTitle}>Need a driver?</Text><Text style={styles.driverDetail}>Select this for a chauffeur-assisted trip. The team will confirm availability and any extra charge.</Text></View><Switch value={withDriver} onValueChange={setWithDriver} trackColor={{ false: "#CBD5E1", true: "#99F6E4" }} thumbColor={withDriver ? BRAND.teal : "#F8FAFC"} /></View>
          <Field label="NOTES (OPTIONAL)" value={notes} onChangeText={setNotes} placeholder="Destination, child seat, special requests..." multiline />
        </FormSection>
        <Text style={styles.disclaimer}>Submitting this form sends a booking request. A Dhule Drive representative will confirm vehicle availability and the final rental amount.</Text>
        <TouchableOpacity disabled={bookingMutation.isPending} onPress={submit} style={[styles.submit, bookingMutation.isPending && styles.submitDisabled]}><Text style={styles.submitLabel}>{bookingMutation.isPending ? "Sending request…" : "Submit booking request"}</Text><MaterialIcons name="arrow-forward" size={19} color={BRAND.navy} /></TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

function FormSection({ title, children }: { title: string; children: ReactNode }) { return <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text>{children}</View>; }
function Field({ label, multiline, ...props }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; keyboardType?: "default" | "phone-pad"; multiline?: boolean }) { return <View style={styles.fieldWrap}><Text style={styles.fieldLabel}>{label}</Text><TextInput {...props} multiline={multiline} placeholderTextColor="#94A3B8" style={[styles.field, multiline && styles.multiline]} /></View>; }

const styles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 42, backgroundColor: BRAND.mist },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 18 },
  back: { height: 40, width: 40, borderRadius: 20, backgroundColor: BRAND.white, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: BRAND.border },
  headerTitle: { color: BRAND.navy, fontWeight: "900", fontSize: 21 }, headerSub: { color: BRAND.muted, fontSize: 12, marginTop: 2 },
  quoteCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: BRAND.navy, borderRadius: 18, padding: 18, marginBottom: 22 },
  quoteLabel: { color: "#FDE68A", fontWeight: "900", fontSize: 10, letterSpacing: 0.9 }, quotePrice: { color: BRAND.white, fontWeight: "900", fontSize: 26, marginTop: 4 }, quoteNote: { color: "#D9E2EC", fontSize: 12, marginTop: 3 },
  section: { backgroundColor: BRAND.white, borderWidth: 1, borderColor: BRAND.border, borderRadius: 18, padding: 16, marginBottom: 14 }, sectionTitle: { color: BRAND.navy, fontSize: 16, fontWeight: "900", marginBottom: 8 },
  fieldWrap: { marginTop: 12 }, fieldLabel: { color: BRAND.muted, fontWeight: "900", fontSize: 10, letterSpacing: 0.7, marginBottom: 6 }, field: { borderWidth: 1, borderColor: BRAND.border, borderRadius: 11, paddingHorizontal: 12, paddingVertical: 11, color: BRAND.slate, fontSize: 14, backgroundColor: "#FBFDFF" }, multiline: { minHeight: 80, textAlignVertical: "top" },
  twoCol: { flexDirection: "row", gap: 10 }, col: { flex: 1 }, driverOption: { flexDirection: "row", alignItems: "center", gap: 15, paddingVertical: 8 }, driverCopy: { flex: 1 }, driverTitle: { color: BRAND.slate, fontSize: 14, fontWeight: "800" }, driverDetail: { color: BRAND.muted, fontSize: 12, lineHeight: 18, marginTop: 3 },
  disclaimer: { color: BRAND.muted, lineHeight: 18, fontSize: 12, margin: 4 }, submit: { backgroundColor: BRAND.saffron, borderRadius: 13, minHeight: 52, marginTop: 16, flexDirection: "row", gap: 9, alignItems: "center", justifyContent: "center" }, submitDisabled: { opacity: 0.6 }, submitLabel: { color: BRAND.navy, fontWeight: "900", fontSize: 15 }, problem: { color: BRAND.navy, fontWeight: "800", fontSize: 16 },
});
