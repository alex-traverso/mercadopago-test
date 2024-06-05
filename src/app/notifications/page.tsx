"use client";

// Initialize the JS client
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_KEY!
);

export default function NotificationsPage() {
	const [notifications, setNotifications] = useState<
		{
			id: number;
			message: string;
			amount: number;
		}[]
	>([]);

	useEffect(() => {
		// Listen to inserts
		supabase
			.channel("donations")
			.on(
				"postgres_changes",
				{ event: "INSERT", schema: "public" },
				(change) => {
					setNotifications((notifications) => [
						...notifications,
						change.new as {
							id: number;
							message: string;
							amount: number;
						},
					]);
				}
			)
			.subscribe();
	}, []);

	useEffect(() => {
		if (notifications.length) {
			const timeout = setTimeout(() => {
				setNotifications((notifications) => notifications.slice(1));
			}, 5000);
		}
	}, [notifications]);

	if (!notifications.length) return null;

	return (
		<section className="grid gap-2 items-center justify-center text-center absolute bottom-4 right-4 bg-[#161616] text-white border p-4 rounded-md">
			<p className="text-2xl font-bold">
				{notifications[0].amount.toLocaleString("es-AR", {
					style: "currency",
					currency: "ARS",
				})}
			</p>
			<p>{notifications[0].message}</p>
		</section>
	);
}
