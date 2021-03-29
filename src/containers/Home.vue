<template>
	<div>
		<h1>Agenda esportiva</h1>

		<br />
		<b-button variant="primary" v-b-modal.addEventsSchedule>Novo evento</b-button>

		<b-modal id="addEventsSchedule" size="lg" title="Criação de atividade esportiva">
			<b-form-group id="input-group-2" label="Evento:" label-for="input-2">
				<b-form-input id="input-2" v-model="eventForm.eventName" required></b-form-input>
			</b-form-group>

			<b-form-group>
				<b-row>
					<b-col sm="12">
						<label for="textarea-small">Descrição:</label>
					</b-col>
					<b-col sm="12">
						<b-form-textarea id="textarea" v-model="eventForm.eventDetail" placeholder="Descrição legal aqui ;)" rows="3" no-resize></b-form-textarea>
					</b-col>
				</b-row>
			</b-form-group>

			<b-form-group>
				<b-row>
					<b-col sm="6">
						<label for="range-1">De:</label>
						<b-form-input v-model="eventForm.eventDate" type="date"></b-form-input>
					</b-col>
					<b-col sm="6">
						<b-row>
							<b-col sm="6">
								<label for="range-1">Inicio:</label>
								<b-form-input v-model="eventForm.startTime" type="time"></b-form-input>
							</b-col>
							<b-col sm="6">
								<label for="range-1">Terminio:</label>
								<b-form-input v-model="eventForm.endTime" type="time"></b-form-input>
							</b-col>
						</b-row>
					</b-col>
				</b-row>
			</b-form-group>

			<b-form-group>
				<b-row>
					<b-col sm="6">
						<b-form-group label="" v-slot="{ ariaDescribedby }">
							<b-form-radio v-model="eventForm.repeatThisEvent" :aria-describedby="ariaDescribedby" name="repeatThisEvent" value="0"
								>Não se repete</b-form-radio
							>
							<b-form-radio v-model="eventForm.repeatThisEvent" :aria-describedby="ariaDescribedby" name="repeatThisEvent" value="1"
								>Repetir</b-form-radio
							>
						</b-form-group>
					</b-col>
					<b-col sm="6">
						<label for="range-1">Intervalo de semanas: {{ eventForm.weekEventRange }}</label>
						<b-form-input
							id="range-1"
							:disabled="eventForm.repeatThisEvent !== '1'"
							v-model="eventForm.weekEventRange"
							type="range"
							min="0"
							max="20"
						></b-form-input>
					</b-col>
				</b-row>
			</b-form-group>

			<template #modal-footer="{ ok, cancel }">
				<b-button :disabled="isRegisterEvent" variant="danger" @click="cancel()">
					Cancelar
				</b-button>

				<b-button :disabled="isRegisterEvent" variant="success" @click="adicionarNovoEvento()">
					Salvar
				</b-button>
			</template>
		</b-modal>

		<br />
		<br />
		<br />

		<vue-cal style="height: 15%" :events="events" />
	</div>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import { get, post } from "../service/service-default/service-default";

export default {
	name: "Home",
	components: { VueCal },
	data() {
		return {
			axiosRequest: {},
			eventForm: {
				eventDetail: "",
				eventName: "",
				weekEventRange: "0",
				repeatThisEvent: 0,
				eventDate: "2021-03-27",
				startTime: null,
				endTime: "",
			},

			isRegisterEvent: false,

			events: [],
		};
	},

	created() {},

	async mounted() {
		await this.getAgendas();
	},

	methods: {
		async getAgendas() {
			try {
				const eventos = await get("/agendas");
				this.events = eventos.data;
			} catch (error) {
				this.events = [];
				console.erro("Não foi possível carregar as agendas.", error);
			}
		},

		isValidDate() {
			const start = new Date(`${this.eventForm.eventDate} ${this.eventForm.startTime}`);
			const end = new Date(`${this.eventForm.eventDate} ${this.eventForm.endTime}`);
			const isStartDateValid = start.toLocaleString() != "Invalid Date" && typeof start == "object";
			const isEndDateValid = end.toLocaleString() != "Invalid Date" && typeof end == "object";
			return isStartDateValid && isEndDateValid;
		},

		formatDateTime(date) {
			let d = new Date(date),
				month = "" + (d.getMonth() + 1),
				day = "" + d.getDate(),
				year = d.getFullYear();

			if (month.length < 2) {
				month = "0" + month;
			}

			if (day.length < 2) {
				day = "0" + day;
			}

			const formatDate = [year, month, day].join("-");
			const formatTime = `${d.getHours()}:00`;
			return formatDate + " " + formatTime;
		},

		getEventsToSave() {
			try {
				const start = new Date(`${this.eventForm.eventDate} ${this.eventForm.startTime}`);
				const end = new Date(`${this.eventForm.eventDate} ${this.eventForm.endTime}`);

				let arrEventsToSave = [
					{
						title: this.eventForm.eventName,
						eventDetail: this.eventForm.eventName,
						class: "reservado",
						eventDate:this.eventForm.eventDate,
						startTime:this.eventForm.startTime,
						endTime:this.eventForm.endTime,
						start: this.formatDateTime(start),
						end: this.formatDateTime(end),
					},
				];

				if (this.eventForm.repeatThisEvent == "1") {
					let objEventToRepeat = { ...arrEventsToSave[0] };
					for (let qtdRepeat = 1; qtdRepeat <= this.eventForm.weekEventRange; qtdRepeat++) {
						let daysToRepeat = 7 * qtdRepeat;
						objEventToRepeat.start = this.formatDateTime(start.addDays(daysToRepeat));
						objEventToRepeat.end = this.formatDateTime(end.addDays(daysToRepeat));
						arrEventsToSave.push({ ...objEventToRepeat });
					}
				}
				return arrEventsToSave;
			} catch (error) {
				console.error("Não foi possível preparar os eventos para salvar", error);
				return [];
			}
		},

		clearForm() {
			this.eventForm = {
				eventDetail: "",
				eventName: "",
				weekEventRange: "0",
				repeatThisEvent: 0,
				eventDate: "",
				startTime: "",
				endTime: "",
			};
		},

		async adicionarNovoEvento() {
			const hasValidDates = this.isValidDate();
			if (!hasValidDates) {
				alert("Data inválida...");
				return;
			}

			const arrEventsToSave = this.getEventsToSave();
			if (arrEventsToSave.length === 0) {
				alert("Não há eventos para salvar...");
				return;
			}

			this.isRegisterEvent = true;
			await post("/agendas", arrEventsToSave);
			this.getAgendas();

			this.events = this.events.concat(arrEventsToSave);
			this.isRegisterEvent = false;
			this.clearForm();
			this.$bvModal.hide("addEventsSchedule");
		},
	},
};
</script>

<style>
.vuecal__event.horario-reservado {
	background-color: #e0d889;
	border: 1px solid #e0d889;
}

.vuecal__event.horario-disponivel {
	background-color: #5ad35e;
	border: 1px solid #5ad35e;
}
</style>
