<script setup lang="ts">
import { useAccountsStore } from '../stores/accounts';
import AccountRow from './AccountRow.vue';
import Button from 'primevue/button';
import Message from 'primevue/message';

const store = useAccountsStore();
</script>

<template>
    <div class="account-list-container">

        <div class="header">
            <h1>Учетные записи</h1>
            <Button
                icon="pi pi-plus"
                aria-label="Добавить"
                @click="store.addAccount()"
                outlined
            />
        </div>

        <Message severity="info" class="mb-4" icon="pi pi-question-circle">
            Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
        </Message>

        <div class="list-header" v-if="store.accounts.length > 0">
            <div>Метки</div>
            <div>Тип записи</div>
            <div>Логин</div>
            <div>Пароль</div>
            <div><!-- Пусто для кнопки удаления --></div>
        </div>

        <div class="list-content">
            <AccountRow
                v-for="account in store.accounts"
                :key="account.id"
                :account="account"
            />
        </div>

        <div v-if="store.accounts.length === 0" class="empty-state">
            <p>Список пуст. Нажмите «+», чтобы добавить запись.</p>
        </div>

    </div>
</template>

<style scoped>
.account-list-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    color: black;
}

h1 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
}

.mb-4 {
    margin-bottom: 1.5rem;
}

.list-header {
    display: grid;
    grid-template-columns: 2fr 1.5fr 2fr 2fr 50px;
    gap: 1rem;
    padding-bottom: 0.5rem;
    color: #888;
    font-size: 0.9rem;
    /* Прячем шапку на мобильных, так как там карточки */
    display: none;
}

@media (min-width: 769px) {
    .list-header {
        display: grid;
    }
}

.empty-state {
    text-align: center;
    color: #999;
    padding: 2rem;
    border: 1px dashed #ccc;
    border-radius: 8px;
    margin-top: 1rem;
}
</style>
