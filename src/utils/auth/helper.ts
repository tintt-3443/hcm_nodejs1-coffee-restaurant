import { CONSTANT } from '../../constant/variable';
import { IGetAllParams } from '../../interface/interface';

export const handleParamsGetAll = (params: {
  page?: number | string;
  limit?: number | string;
}): IGetAllParams => {
  // page default 1 and limit default 10
  if (!params.page || isNaN(Number(params.page)) || Number(params.page) < 1) {
    params.page = CONSTANT.PAGE_DEFAULT;
  }
  if (
    !params.limit ||
    isNaN(Number(params.limit)) ||
    Number(params.limit) < 1
  ) {
    params.limit = CONSTANT.LIMIT_DEFAULT;
  }

  return params as IGetAllParams;
};

export const createPagination = (totalPages: number, currentPage: number) => {
  let paginationHTML = '';

  paginationHTML += '<li class="page-item">';
  if (currentPage > 1) {
    paginationHTML += `<a class="page-link" href="?page=${encodeURIComponent(
      currentPage - 1,
    )}&limit=${encodeURIComponent(CONSTANT.LIMIT_DEFAULT)}">&laquo;</a>`;
  } else {
    paginationHTML += '<span class="page-link">&laquo;</span>';
  }
  paginationHTML += '</li>';

  const startPage = Math.max(
    1,
    Math.floor((currentPage - 1) / CONSTANT.TOTAL_PAGES) *
      CONSTANT.TOTAL_PAGES +
      1,
  );

  for (let i = startPage; i <= startPage + 4; i++) {
    paginationHTML += '<li class="page-item">';
    if (i === currentPage) {
      paginationHTML += `<span class="page-link active">${i}</span>`;
    } else {
      paginationHTML += `<a class="page-link" href="?page=${encodeURIComponent(
        i,
      )}&limit=${encodeURIComponent(CONSTANT.LIMIT_DEFAULT)}">${i}</a>`;
    }
    paginationHTML += '</li>';
  }

  paginationHTML += '<li class="page-item">';
  if (currentPage < totalPages) {
    paginationHTML += `<a class="page-link" href="?page=${encodeURIComponent(
      +currentPage + 1,
    )}&limit=${encodeURIComponent(CONSTANT.LIMIT_DEFAULT)}">&raquo;</a>`;
  } else {
    paginationHTML += '<span class="page-link">&raquo;</span>';
  }
  paginationHTML += '</li>';

  return paginationHTML;
};

export const VNDFormat = (num: number): string => {
  const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
  return VND.format(num);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const flatObject = (input: any): { [key: string]: object } => {
  const flat = (
    res: { [key: string]: object },
    val: any,
    pre = '',
  ): { [key: string]: object } => {
    if (typeof val === 'object' && !Array.isArray(val)) {
      return Object.keys(val).reduce(
        (prev, curr) => flat(prev, val[curr], curr),
        res,
      );
    } else {
      return Object.assign(res, { [pre]: val });
    }
  };

  return Object.keys(input).reduce(
    (prev, curr) => flat(prev, input[curr], curr),
    {},
  );
};

export const formatDate = (date: Date) => {
  const options = {
    hour12: false,
  };
  const dateFormat = date.toLocaleString('vi-VN', options);
  return dateFormat;
};
