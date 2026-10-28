import * as z from 'zod';

export const treatmentSchema = z.object({
    treatmentId: z.string().min(1, '시술을 선택해주세요.'),
    category: z.string().min(1, '카테고리를 선택해주세요'),
    treatmentName: z.string().min(1, '시술명이 올바르지않습니다.'),
    totalCount: z.number().min(1, '최소 1회 이상 선택해야 합니다.'),
    price: z.number().min(0, '올바른 금액을 입력해 주세요.'),
    paymentMethod: z.enum(['CARD', 'CASH', 'TRANSFER'], {
            message: '결제 수단을 선택해 주세요.' ,
    })
});

export type TreatmentFormInput = z.infer<typeof treatmentSchema>;
