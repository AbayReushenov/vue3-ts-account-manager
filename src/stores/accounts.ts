import { defineStore } from 'pinia';
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import type { Account } from '../types';

export const useAccountsStore = defineStore('accounts', () => {
    const accounts = ref<Account[]>([]);

    const addAccount = () => {
        accounts.value.push({
            id: uuidv4(),
            labels: [],
            type: 'Local',
            login: '',
            password: ''
        });
    };

    const removeAccount = (id: string) => {
        accounts.value = accounts.value.filter(acc => acc.id !== id);
    };

    const updateAccount = (updatedAccount: Account) => {
        const index = accounts.value.findIndex(a => a.id === updatedAccount.id);
        if (index !== -1) {
            accounts.value[index] = updatedAccount;
        }
    };

    return {
        accounts,
        addAccount,
        removeAccount,
        updateAccount
    };
},

{
    persist: true
});
