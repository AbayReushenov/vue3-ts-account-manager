<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAccountsStore } from '../stores/accounts';
import type { Account } from '../types';

import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Password from 'primevue/password';
import Button from 'primevue/button';

const props = defineProps<{
    account: Account;
}>();

const store = useAccountsStore();

const isLoginInvalid = ref(false);
const isPasswordInvalid = ref(false);

const validateLogin = () => {
    const val = props.account.login.trim();
    isLoginInvalid.value = val.length === 0 || val.length > 100;
};

const validatePassword = () => {
    // Если тип Local
    if (props.account.type === 'Local') {
        const val = props.account.password || '';
        isPasswordInvalid.value = val.length === 0 || val.length > 100;
    } else {
        isPasswordInvalid.value = false;
    }
};

// конвертация поля в отображаемые и хранимые данные
const labelsString = computed({
    get: () => {
        return props.account.labels.map(l => l.text).join('; ');
    },
    set: (newValue: string) => {
        const textLabels = newValue.split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        props.account.labels = textLabels.map(text => ({ text }));
    }
});

const accountTypes = ref(['Local', 'LDAP']);

// При смене типа нужно чистить пароль и перепроверять валидацию
const onTypeChange = () => {
    if (props.account.type === 'LDAP') {
        props.account.password = null;
        isPasswordInvalid.value = false; // Ошибка пароля не актуальна для LDAP
    } else {
        props.account.password = ''; // Возвращаем пустую строку для ввода
    }
};

</script>

<template>
    <div class="account-row">

        <!-- 1. МЕТКИ -->
        <div class="field">
            <label class="mobile-label">Метки</label>
            <InputText
                v-model="labelsString"
                placeholder="Метка1; Метка2"
                class="w-full"
                maxlength="50"
                @blur="() => {} /* Метки необязательны по ТЗ, валидации нет */"
            />
        </div>

        <!-- 2. ТИП ЗАПИСИ -->
        <div class="field">
            <label class="mobile-label">Тип</label>
            <Select
                v-model="props.account.type"
                :options="accountTypes"
                class="w-full"
                @change="onTypeChange"
            />
        </div>

        <!-- 3. ЛОГИН -->
        <div class="field">
            <label class="mobile-label">Логин</label>
            <InputText
                v-model="props.account.login"
                :class="{ 'p-invalid': isLoginInvalid }"
                class="w-full"
                maxlength="100"
                @blur="validateLogin"
            />
            <small v-if="isLoginInvalid" class="error-text">Обязательное поле</small>
        </div>

        <!-- 4. ПАРОЛЬ -->
        <div class="field">
            <label class="mobile-label">Пароль</label>
            <!-- Показываем только если Local -->
            <Password
                v-if="props.account.type === 'Local'"
                v-model="props.account.password as string"
                :class="{ 'p-invalid': isPasswordInvalid }"
                toggleMask
                :feedback="false"
                class="w-full"
                maxlength="100"
                @blur="validatePassword"
            />
            <small v-if="isPasswordInvalid && props.account.type === 'Local'" class="error-text">Обязательное поле</small>
        </div>

        <!-- 5. КНОПКА УДАЛЕНИЯ -->
        <div class="field action">
            <Button
                icon="pi pi-trash"
                severity="secondary"
                text
                aria-label="Delete"
                @click="store.removeAccount(account.id)"
            />
        </div>
    </div>
</template>

<style scoped>
.account-row {
    display: grid;
    /* Сетка как на макете: 4 колонки с данными + кнопка */
    grid-template-columns: 2fr 1.5fr 2fr 2fr 50px;
    gap: 1rem;
    align-items: start; /* Выравнивание по верху, чтобы ошибки не ломали сетку */
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
}

.error-text {
    color: var(--p-red-500);
    font-size: 0.75rem;
    display: block;
    margin-top: 0.25rem;
}

/* Адаптив: на мобилках превращаем строку в карточку */
@media (max-width: 768px) {
    .account-row {
        display: flex;
        flex-direction: column;
        border: 1px solid #ddd;
        padding: 1rem;
        border-radius: 8px;
    }

    .mobile-label {
        display: block;
        margin-bottom: 0.25rem;
        font-weight: bold;
        font-size: 0.875rem;
        color: #666;
    }

    .field {
        width: 100%;
        margin-bottom: 0.5rem;
    }

    .action {
        text-align: right;
    }
}

/* На десктопе прячем лейблы, так как есть шапка таблицы */
@media (min-width: 769px) {
    .mobile-label {
        display: none;
    }
}
</style>
