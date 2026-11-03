import React, { useEffect } from 'react';
import { useAddTreatment } from '../hooks/useAddTreatment'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { treatmentSchema, TreatmentFormInput } from '@/schema/treatmentSchema'
import { Popup } from '@/ui/modal/Popup';
import * as S from './AddTreatment.style'
import TREATMENT_CATALOG from '@/data/treatment/dummy.json'
import {
  FaWandMagicSparkles,
  FaSyringe,
  FaUserDoctor,
  FaXmark,
} from "react-icons/fa6";
import { useToastContext } from '@/ui/feedback/toast/ToastContext';

interface AddTreatmentModalProps{
    chartNo: string;
    isOpen: boolean;
    onClose: ()=> void;
}

const CATE_OPTIONS = [
  {
    value: "SKIN",
    label: "피부 시술",
    Icon: FaWandMagicSparkles,
  },
  {
    value: "INJECTION",
    label: "주사 시술",
    Icon: FaSyringe,
  },
  {
    value: "SURGERY",
    label: "성형 수술",
    Icon: FaUserDoctor,
  },
] as const;

const PAYMENT_OPTION=[
    { value: "CARD", label: "카드" },
    { value: "CASH", label: "현금" },
    { value: "TRANSFER", label: "계좌이체" },
]

const COUNT_OPTIONS = [1, 3, 5, 10] as const;

const formattedPrice = (price:number)=>{
  return new Intl.NumberFormat('ko-KR').format(price)
}

export const AddTreatmentModal=({chartNo, isOpen, onClose}: AddTreatmentModalProps)=>{

    const {showToast} =useToastContext();
    const { mutate, isPending, reset:resetMutation } = useAddTreatment(chartNo);

     const {
        register, 
        handleSubmit, 
        reset, 
        watch, 
        setValue, 
        formState: { errors, isSubmitting},
      } = useForm<TreatmentFormInput>({
        resolver: zodResolver(treatmentSchema),  //스키마연결
        defaultValues:{
          category: "SKIN",
          treatmentName: '',
          totalCount: 1,
          price: 0,
          paymentMethod: 'CARD',
        },
      })
    
  const selectedCategory = watch('category');
  const selectedName = watch("treatmentName");
  const selectedCount = watch("totalCount");

  const availableTreatments = TREATMENT_CATALOG.filter(
    item =>  item.category  === selectedCategory
  )

  const selectedTreatments = TREATMENT_CATALOG.find(item=>(
    item.category === selectedCategory && 
    item.name === selectedName
  ))

  const selectedPackage = selectedTreatments?.packages.find(item=>(
    item.count === selectedCount
  ));

  // 시술이나 패키지 횟수가 바뀌면 가격 자동 입력
  useEffect(()=>{
    if(selectedPackage){
      setValue("price", selectedPackage.price, {
        shouldValidate: true,
      })
    }
  },[selectedPackage, setValue])

  // 카테고리를 바꾸면 기존 시술 선택 초기화
  const handleCategoryChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const category = e.target.value;
    setValue('category', category as TreatmentFormInput['category'], {shouldValidate:true} )

    setValue('treatmentName', "");
    setValue('totalCount', 1);
    setValue('price', 0);
  };

  const treatmentField = register('treatmentName');

  const handleTreatmentChange = (e:React.ChangeEvent<HTMLSelectElement>)=>{

    treatmentField.onChange(e); //변경된 시술명을 React Hook Form에 전달

    const name = e.target.value;

    const treatment = TREATMENT_CATALOG.find(item=>(
      item.category === selectedCategory && 
      item.name === name
    ))
    const firstPakage = treatment?.packages[0];

    setValue('totalCount', firstPakage?.count ?? 1 ,{shouldValidate:true})
    setValue('price', firstPakage?.price ?? 0 , {shouldValidate:true})
  }

  const onSubmit = (data:TreatmentFormInput)=>{
    mutate({...data, chartNo}, {
      onSuccess: ()=>{
        showToast('시술권이 등록되었습니다.', 'success')
        onClose()
      },
      onError:()=>{
          showToast('시술권 등록에 실패했습니다. 다시 시도해 주세요.', 'error');
      }
    })
  }
  // 모달을 닫힐때 reset() 초기화
  useEffect(()=>{
    if(!isOpen){
      reset();
      resetMutation();
    }
  },[isOpen, reset])

  if (!isOpen) return null;

  return(
    <>
    <S.TreatmentOverlay>
    <S.TreatmentModal
      role="dialog"
      aria-modal="true"
      aria-labelledby="treatment-modal-title"
    >
      <S.GlassShine />

      {/* 헤더 */}
      <S.ModalHeader>
        <S.ModalHeading>
          <S.ModalEyebrow>
            TREATMENT · REGISTER
          </S.ModalEyebrow>

          <S.ModalTitle id="treatment-modal-title">
            시술 및 수술 등록
          </S.ModalTitle>

          <S.FormDescription>
          환자에게 등록할 시술권과 결제 정보를 입력해 주세요.
          </S.FormDescription>
        </S.ModalHeading>

        <S.CloseButton
          type="button"
          onClick={onClose}
          disabled={isPending || isSubmitting}
          aria-label="닫기"
        >
          <FaXmark size={16} />
        </S.CloseButton>
      </S.ModalHeader>

      {/* 폼 영역 */}
      <S.TreatmentFormWrapper onSubmit={handleSubmit(onSubmit)}>
        <S.ModalBody>
          <S.TreatmentForm>
            <S.FormHeader>
             
            </S.FormHeader>

            {/* 카테고리 */}
            <S.FormField>
              <S.FieldLabel>
                카테고리
                <S.RequiredMark>*</S.RequiredMark>
              </S.FieldLabel>

              <S.CategoryOptions>
                {CATE_OPTIONS.map(({ value, label, Icon }) => (
                  <S.CategoryOption
                    key={value}
                    $selected={selectedCategory === value}
                  >
                    <input
                      type="radio"
                      value={value}
                      checked={selectedCategory === value}
                      onChange={handleCategoryChange}
                    />

                    <Icon size={17} />
                    <span>{label}</span>
                  </S.CategoryOption>
                ))}
              </S.CategoryOptions>

              {errors.category && (
                <S.ErrorText>
                  {errors.category.message}
                </S.ErrorText>
              )}
            </S.FormField>

            {/* 시술명 */}
            <S.FormField>
              <S.FieldLabel>
                시술 및 수술명
                <S.RequiredMark>*</S.RequiredMark>
              </S.FieldLabel>

              <S.Select
                {...register("treatmentName")}
                value={selectedName}
                onChange={handleTreatmentChange}
              >
                <option value="" disabled>
                  항목을 선택하세요
                </option>

                {availableTreatments.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </S.Select>

              {errors.treatmentName && (
                <S.ErrorText>
                  {errors.treatmentName.message}
                </S.ErrorText>
              )}
            </S.FormField>

            <S.FormGrid>
              {/* 총 횟수 */}
              <S.FormField>
                <S.FieldLabel>
                  총 횟수
                  <S.RequiredMark>*</S.RequiredMark>
                </S.FieldLabel>

                <S.CountOptions>
                  {COUNT_OPTIONS.map((item) => (
                    <S.CountOption
                      key={item}
                      $selected={selectedCount === item}
                    >
                      <input
                        type="radio"
                        name="totalCount"
                        value={item}
                        checked={selectedCount === item}
                        onChange={() => {
                          setValue('totalCount', item, {
                            shouldValidate: true,
                          });
                        }}
                      />

                      {`${item}회`}
                    </S.CountOption>
                  ))}
                </S.CountOptions>

                {errors.totalCount && (
                  <S.ErrorText>
                    {errors.totalCount.message}
                  </S.ErrorText>
                )}
              </S.FormField>

              {/* 결제 금액 */}
              <S.FormField>
                <S.FieldLabel>
                  결제 금액
                  <S.RequiredMark>*</S.RequiredMark>
                </S.FieldLabel>

                <S.PriceBox>
                  <S.PriceInput
                    type="number"
                    min="0"
                    step="1000"
                    {...register("price", {
                      valueAsNumber: true,
                    })}
                  />

                  <S.PriceUnit>원</S.PriceUnit>
                </S.PriceBox>

                {errors.price && (
                  <S.ErrorText>
                    {errors.price.message}
                  </S.ErrorText>
                )}
              </S.FormField>

              {selectedPackage && (
                <S.HelperText>
                  <span className="description">
                    선택한 패키지 기본 가격
                  </span>

                  <span className="price">
                    {formattedPrice(selectedPackage.price)}원
                  </span>
                </S.HelperText>
              )}
            </S.FormGrid>

            {/* 결제 수단 */}
            <S.FormField>
              <S.FieldLabel>
                결제 수단
                <S.RequiredMark>*</S.RequiredMark>
              </S.FieldLabel>

              <S.PaymentOptions>
                {PAYMENT_OPTION.map(({ value, label }) => (
                  <S.PaymentOption key={value}>
                    <input
                      type="radio"
                      value={value}
                      {...register('paymentMethod')}
                    />

                    <span>{label}</span>
                  </S.PaymentOption>
                ))}
              </S.PaymentOptions>

              {errors.paymentMethod && (
                <S.ErrorText>
                  {errors.paymentMethod.message}
                </S.ErrorText>
              )}
            </S.FormField>
          </S.TreatmentForm>
        </S.ModalBody>

        {/* 하단 등록 버튼 */}
        <S.ModalFooter>
          <S.SubmitButton
            type="submit"
            disabled={isPending || isSubmitting}
          >
            {isPending || isSubmitting
              ? '등록 중...'
              : '시술권 등록'}
          </S.SubmitButton>
        </S.ModalFooter>
      </S.TreatmentFormWrapper>
    </S.TreatmentModal>
    </S.TreatmentOverlay>
    </>
  )
}




