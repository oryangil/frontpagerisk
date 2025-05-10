import React from 'react';
import { toast } from 'react-toastify';

class Toaster {
  public static success(title?: string, contents?: Array<any>): void {
    toast.success(
      <div>
        <div className="fs-6 fw-bold" style={{ lineHeight: '24px' }}>
          {title}
        </div>
        {contents?.map((content, index) => (
          <div key={index} className="fs-6" style={{ lineHeight: '24px' }}>
            {`${content}`}
          </div>
        ))}
      </div>,
      {
        hideProgressBar: true,
      }
    );
  }

  public static error(title?: string, contents?: Array<any>): void {
    toast.error(
      <div>
        <div className="fs-6 fw-bold" style={{ lineHeight: '24px' }}>
          {title}
        </div>
        {contents?.map((content, index) => (
          <div key={index} className="fs-6" style={{ lineHeight: '24px' }}>
            {`${content}`}
          </div>
        ))}
      </div>,
      {
        hideProgressBar: true,
      }
    );
  }

  public static info(title?: string, contents?: Array<any>): void {
    toast.info(
      <div>
        <div className="fs-6 fw-bold" style={{ lineHeight: '24px' }}>
          {title}
        </div>
        {contents?.map((content, index) => (
          <div key={index} className="fs-6" style={{ lineHeight: '24px' }}>
            {`${content}`}
          </div>
        ))}
      </div>,
      {
        hideProgressBar: true,
      }
    );
  }

  public static warning(title?: string, contents?: Array<any>): void {
    toast.warning(
      <div>
        <div className="fs-6 fw-bold" style={{ lineHeight: '24px' }}>
          {title}
        </div>
        {contents?.map((content, index) => (
          <div key={index} className="fs-6" style={{ lineHeight: '24px' }}>
            {`${content}`}
          </div>
        ))}
      </div>,
      {
        hideProgressBar: true,
      }
    );
  }
}

export default Toaster;
